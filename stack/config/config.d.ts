import { RemovalPolicy } from "aws-cdk-lib"
import { AuroraMysqlEngineVersion } from "aws-cdk-lib/aws-rds"
import * as Ec2 from "aws-cdk-lib/aws-ec2"

interface Config {
  account: string,
  region: string,
  resourceName: string,
  stackName: string,
  ecrRepository: {
    removalPolicy: RemovalPolicy,
    autoDeleteImage: boolean,
  },
  logGroup: {
    removalPolicy: RemovalPolicy,
  },
  route53: {
    hostedZoneId: string,
    hostedZoneName: string,
    subDomainName: string,
  },
  elb: {
    certificateArn: string,
  },
  rds: {
    removalPolicy: RemovalPolicy,
    defaultDatabaseName: string,
    mysqlVersion: AuroraMysqlEngineVersion,
    instanceClass: Ec2.InstanceClass,
    instanceSize: Ec2.InstanceSize,
    // 冗長構成にするか？
    hasReader: boolean,
  }
}