# ecs_parctice
LaravelをECSで稼働させるテスト

## スタートガイド
### 関連ライブラリのインストール
```
npm install
```

### CDK利用の下準備
複数のプロファイルをAWS CLIに設定している場合は使用するアカウントを指定
```
export AWS_PROFILE={プロファイル名}
```
CDKを実行するための下準備を実行(アカウントのCFnにCDKToolkitスタックがあれば実行済み)
```
cdk bootstrap
```

### 環境変数設定
- `stack/config/example.ts`をコピーして必要な値を設定

### デプロイ
```
cdk deploy
```

### 参考
ECSとECRのコンテナ構成をCDKで実装してみた
https://dev.classmethod.jp/articles/cdk-ecs-ecr/

ecr-deploymentを使ってCDKでECRの名前を指定してdocker pushする
https://chariosan.com/2021/10/24/cdk_ecr_deployment_docker_push/

Docker上で動くLaravel(PHP)をAWS ECS-Fargateにデプロイする(codecommit/codepipeline/codebuild/codedeploy)
https://it.kensan.net/docker%E4%B8%8A%E3%81%A7%E5%8B%95%E3%81%8Flaravelphp%E3%82%92aws-ecs%E3%81%AB%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4%E3%81%99%E3%82%8B.html