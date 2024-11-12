# ecs_practice
AWS CDKを利用して、以下の環境を構築する
- Laravel11
- Fargate + ECS

## スタートガイド
### AWS認証情報設定
以下のファイルをコピー&リネームし、アカウントの情報を記載
- `.aws-config.exmaple` => `.aws-config`
- `.aws-credentials.exmaple` => `.aws-credentials`

### コンテナの起動と依存関係のインストール
```bash
docker compose build
docker compose up -d
docker compose exec cdk npm install
```

### CDK利用の下準備
CDKを実行するためのbootstrapを実行(アカウントのCFnにCDKToolkitスタックがあれば実行済み)
```bash
docker compose exec cdk cdk bootstrap
```

### 各種値の設定
以下のファイルをコピー&リネームして必要な値を設定
- `stack/config/example.ts` => `stack/config/develop.ts`

以上で実行準備は完了です。

## デプロイ
コンテナを介してCDKを実行する。
※dev以外は自分で`package.json`にスクリプト設定してください。
```bash
# CFnのみ実行
docker compose exec cdk npm run cdk:deploy:dev
# コンテナもデプロイ
docker compose exec cdk npm run cdk:deploy:dev:with-ecr
```

## マイグレーションとシード実行
実行用のコンテナを作成していないのでAWSコンソールから実行
AWSコンソール>ECS>該当クラスター>タスク>新しいタスクの実行
以下の項目を適宜設定
- デプロイ設定
  - ファミリー
- ネットワーキング
  - VPC
  - サブネット
  - セキュリティグループ
- コンテナの上書き
  - コマンドの上書き: 実行するコマンドを","区切りで記載
    - マイグレーション: `php,artisan,migrate`
    - シード実行: `php,artisan,db:seed`

## 今後やりたいこと
- 環境変数をSystemsManagerで管理(今はローカルの.envを参照してしまっている)
  - DB周りの環境変数だけSecretsManagerから引っ張ってきている。
- マイグレーション&シード用コンテナ作る
- RDSクラスターのインスタンス数をconfigで管理(ライターとリーダーが別プロパティなのでとりあえずライターのみ設定できるようにしている)

## 参考
### CDKの中身
ECSとECRのコンテナ構成をCDKで実装してみた
https://dev.classmethod.jp/articles/cdk-ecs-ecr/

ecr-deploymentを使ってCDKでECRの名前を指定してdocker pushする
https://chariosan.com/2021/10/24/cdk_ecr_deployment_docker_push/

Docker上で動くLaravel(PHP)をAWS ECS-Fargateにデプロイする(codecommit/codepipeline/codebuild/codedeploy)
https://it.kensan.net/docker%E4%B8%8A%E3%81%A7%E5%8B%95%E3%81%8Flaravelphp%E3%82%92aws-ecs%E3%81%AB%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4%E3%81%99%E3%82%8B.html

AWS CDKでECS/FargateとRDSを作成
https://zenn.dev/akira_abe/articles/20220220-aws-cdk-fargate

### CDK実行用のコンテナ
How to run Docker in Docker on Mac
https://www.saltycrane.com/blog/2021/04/how-run-docker-docker-mac/