import { RemovalPolicy } from "aws-cdk-lib"

export const config = {
  account: "xxxxxxxxxxxxxx",
  region: "ap-northeast-1",
  // スタック名
  stackName: "xxxxxx-stack",
  resourceName: "xxxxxxxxxxxxx",
  ecrRepository: {
    // お試しなのでスタック削除時はまとめて削除、本番では非推奨
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteImage: true,
  },
  logGroup: {
    // お試しなのでスタック削除時はまとめて削除、本番では非推奨
    removalPolicy: RemovalPolicy.DESTROY,
  }
}