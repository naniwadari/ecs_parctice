import { RemovalPolicy, ScopedAws, Stack, StackProps } from "aws-cdk-lib"
import * as Ecr from "aws-cdk-lib/aws-ecr"
import * as EcrDeploy from "cdk-ecr-deployment"
import * as Ec2 from "aws-cdk-lib/aws-ec2"
import * as Ecs from "aws-cdk-lib/aws-ecs"
import * as Logs from "aws-cdk-lib/aws-logs"
import * as EcsPatterns from "aws-cdk-lib/aws-ecs-patterns"
import { Construct } from "constructs"
import { config } from "./config/test"
import { DockerImageAsset, Platform } from "aws-cdk-lib/aws-ecr-assets"
import * as path from "path"

export class EcsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const { accountId, region } = new ScopedAws(this)

    const resourceName = config.resourceName

    const ecrRepository = new Ecr.Repository(this, "EcrRepo", {
      repositoryName: `${resourceName}-ecr-repo`,
      removalPolicy: config.ecrRepository.removalPolicy,
      emptyOnDelete: config.ecrRepository.autoDeleteImage,
    })

    const dockerImageAsset = new DockerImageAsset(this, "DockerImageAsset", {
      directory: path.join(__dirname, "..", "app"),
      platform: Platform.LINUX_AMD64,
    })

    new EcrDeploy.ECRDeployment(this, "DeployDockerImage", {
      src: new EcrDeploy.DockerImageName(dockerImageAsset.imageUri),
      dest: new EcrDeploy.DockerImageName(
        `${accountId}.dkr.ecr.${region}.amazonaws.com/${ecrRepository.repositoryName}:latest`
      )
    })

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
        taskImageOptions: {
          family: `${resourceName}-taskdef`,
          containerName: `${resourceName}-container`,
          image: Ecs.ContainerImage.fromEcrRepository(ecrRepository, "latest"),
          logDriver: new Ecs.AwsLogDriver({
            streamPrefix: `container`,
            logGroup: logGroup,
          })
        },
      }
    )
  }
}