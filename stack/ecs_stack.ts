import { RemovalPolicy, ScopedAws, Stack, StackProps } from "aws-cdk-lib"
import * as Ecr from "aws-cdk-lib/aws-ecr"
import * as EcrDeploy from "cdk-ecr-deployment"
import * as Ec2 from "aws-cdk-lib/aws-ec2"
import * as Ecs from "aws-cdk-lib/aws-ecs"
import * as Logs from "aws-cdk-lib/aws-logs"
import * as EcsPatterns from "aws-cdk-lib/aws-ecs-patterns"
import * as Route53 from "aws-cdk-lib/aws-route53"
import { Construct } from "constructs"
import { DockerImageAsset, Platform } from "aws-cdk-lib/aws-ecr-assets"
import * as path from "path"
import { ApplicationProtocol } from "aws-cdk-lib/aws-elasticloadbalancingv2"
import { Certificate } from "aws-cdk-lib/aws-certificatemanager"

export class EcsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    const env = process.env.CDK_ENV
    const withEcr = process.env.WITH_ECR === "true"
    const config = require("./config/"+env).config
    console.log(config)
    super(scope, id, props)
    const { accountId, region } = new ScopedAws(this)
    const resourceName = config.resourceName

    // Nginx用リポジトリ
    const ecrRepositoryNginx = new Ecr.Repository(this, "EcrRepoNginx", {
      repositoryName: `${resourceName}-ecr-repo-nginx`,
      removalPolicy: config.ecrRepository.removalPolicy,
      emptyOnDelete: config.ecrRepository.autoDeleteImage,
    })

    // PHP用リポジトリ
    const ecrRepositoryPhp = new Ecr.Repository(this, "EcrRepoPhp", {
      repositoryName: `${resourceName}-ecr-repo-php`,
      removalPolicy: config.ecrRepository.removalPolicy,
      emptyOnDelete: config.ecrRepository.autoDeleteImage,
    })

    // コンテナ更新
    if (withEcr) {
      // Nginx
      const dockerImageAssetNginx = new DockerImageAsset(this, "DockerImageAssetNginx", {
        // Dockerfileは親ディレクトリ参照できないのでdirecotryとfileを別で定義
        directory: '.',
        file: "docker/nginx/Dockerfile",
        platform: Platform.LINUX_AMD64,
      })
      new EcrDeploy.ECRDeployment(this, "DeployDockerImageNginx", {
        src: new EcrDeploy.DockerImageName(dockerImageAssetNginx.imageUri),
        dest: new EcrDeploy.DockerImageName(
          `${accountId}.dkr.ecr.${region}.amazonaws.com/${ecrRepositoryNginx.repositoryName}:latest`
        )
      })

      // PHP
      const dockerImageAssetPhp = new DockerImageAsset(this, "DockerImageAssetPhp", {
        directory: '.',
        file: path.join("docker/php/Dockerfile"),
        platform: Platform.LINUX_AMD64,
      })
      new EcrDeploy.ECRDeployment(this, "DeployDockerImagePhp", {
        src: new EcrDeploy.DockerImageName(dockerImageAssetPhp.imageUri),
        dest: new EcrDeploy.DockerImageName(
          `${accountId}.dkr.ecr.${region}.amazonaws.com/${ecrRepositoryPhp.repositoryName}:latest`
        )
      })
    }

    const vpc = new Ec2.Vpc(this, "Vpc", {
      vpcName: `${resourceName}-vpc`,
      maxAzs: 2,
      ipAddresses: Ec2.IpAddresses.cidr("10.0.0.0/20"),
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: `${resourceName}-public`,
          subnetType: Ec2.SubnetType.PUBLIC,
        },
      ],
    })

    const cluster = new Ecs.Cluster(this, "EcsCluster", {
      clusterName: `${resourceName}-cluster`,
      vpc: vpc,
    })

    const logGroup = new Logs.LogGroup(this, "LogGroup", {
      logGroupName: `/aws/ecs/${resourceName}`,
      removalPolicy: config.logGroup.removalPolicy,
    })

    /**
     * タスクとコンテナのポートとログを定義
     */
    const taskDefinition = new Ecs.FargateTaskDefinition(this, "TaskDefinition", {
      family: `${resourceName}-taskdef`
    })

    const nginxContainer = taskDefinition.addContainer('nginx', {
      image: Ecs.ContainerImage.fromEcrRepository(ecrRepositoryNginx, "latest"),
      portMappings: [
        {
          hostPort: 80,
          containerPort: 80,
        }
      ],
      logging: new Ecs.AwsLogDriver({
        streamPrefix: `nginx`,
        logGroup: logGroup,
      }),
    })

    const appContainer = taskDefinition.addContainer('app', {
      image: Ecs.ContainerImage.fromEcrRepository(ecrRepositoryPhp, "latest"),
      portMappings: [
        {
          hostPort: 9000,
          containerPort: 9000,
        }
      ],
      logging: new Ecs.AwsLogDriver({
        streamPrefix: `app`,
        logGroup: logGroup,
      }),
    })

    // コンテナの依存関係を定義
    nginxContainer.addContainerDependencies({
      container: appContainer,
      condition: Ecs.ContainerDependencyCondition.START
    })

    // 証明書の取得
    const certificate = Certificate.fromCertificateArn(this, "Certificate", config.certificateArn)
    // ホストゾーンの取得
    const hostedZone = Route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZoneId",
      {
        hostedZoneId: config.route53HostedZoneID,
        zoneName: config.route53HostedZoneName,
      },
    )
        
    /**
     * ECSパターンズのテンプレートを利用したELB+Fargateの構築
     * @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns.ApplicationLoadBalancedFargateService.html
     */
    const service = new EcsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "FargateService",
      {
        loadBalancerName: `${resourceName}-lb`,
        publicLoadBalancer: true,
        cluster: cluster,
        serviceName: `${resourceName}-service`,
        cpu: 256,
        desiredCount: 2,
        memoryLimitMiB: 512,
        assignPublicIp: true,
        taskSubnets: { subnetType: Ec2.SubnetType.PUBLIC },
        // ELBの待ち受けプロトコル
        protocol: ApplicationProtocol.HTTPS,
        // ELB=>コンテナのプロトコル
        targetProtocol: ApplicationProtocol.HTTP,
        taskDefinition: taskDefinition,
        domainName: config.route53SubDomainName,
        domainZone: hostedZone,
        certificate: certificate,
      }
    )
  }
}