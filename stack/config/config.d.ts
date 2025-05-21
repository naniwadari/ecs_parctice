import { RemovalPolicy } from "aws-cdk-lib"
import { AuroraMysqlEngineVersion } from "aws-cdk-lib/aws-rds"
import * as Ec2 from "aws-cdk-lib/aws-ec2"

interface Config {
  env: string,
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
  },
  environment: {
    APP_NAME: string,
    APP_KEY: string,
    APP_DEBUG: string,
    APP_TIMEZONE: string,
    APP_URL: string,
    APP_LOCALE: string,
    APP_FALLBACK_LOCALE: string,
    APP_MAINTENANCE_DRIVER: string,
    LOG_CHANNEL: string,
    LOG_STACK: string,
    LOG_DEPRECATIONS_CHANNEL: string,
    LOG_LEVEL: string,
    DB_CONNECTION: string,
  }
}