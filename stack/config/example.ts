import { RemovalPolicy } from "aws-cdk-lib"
import * as Ec2 from "aws-cdk-lib/aws-ec2"
import { AuroraMysqlEngineVersion } from "aws-cdk-lib/aws-rds"
import { Config } from "./config";

export const config: Config = {
  env: "example",
  account: "",
  region: "",
  resourceName: "",
  stackName: "",
  ecrRepository: {
    // お試しなのでスタック削除時はまとめて削除、本番では非推奨
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteImage: true,
  },
  logGroup: {
    // お試しなのでスタック削除時はまとめて削除、本番では非推奨
    removalPolicy: RemovalPolicy.DESTROY,
  },
  route53: {
    // ベースとなるドメインとホストゾーンIDと名称
    hostedZoneId: "",
    hostedZoneName: "", //ex. example.com
    // サブドメインの名前
    subDomainName: "",
  },
  elb: {
    // ALBで利用する証明書
    certificateArn: "arn:aws:acm:ap-northeast-1:xxxxxxxxxx",
  },
  rds: {
    removalPolicy: RemovalPolicy.DESTROY,
    // デフォルトデータベース名
    defaultDatabaseName: "",
    // バージョン指定(作成時点の最新&最小)
    mysqlVersion: AuroraMysqlEngineVersion.VER_3_07_1,
    instanceClass: Ec2.InstanceClass.BURSTABLE3,
    instanceSize: Ec2.InstanceSize.MEDIUM,
    // 冗長構成にするか？
    hasReader: false,
  },
  // デプロイ時の環境変数
  environment: {
    APP_NAME: "",
    APP_KEY: "",
    APP_DEBUG: "",
    APP_TIMEZONE: "",
    APP_URL: "",
    APP_LOCALE: "",
    APP_FALLBACK_LOCALE: "",
    LOG_CHANNEL:"",
    LOG_STACK:"",
    LOG_DEPRECATIONS_CHANNEL:"",
    LOG_LEVEL:"",
    DB_CONNECTION: "",
  }
}