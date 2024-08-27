# ecs_parctice

## スタートガイド

### CDK利用の下準備
複数のアカウントをAWS CLIに設定している場合は使用するアカウントを指定
```
export AWS_PROFILE={環境名}
```
CDKを実行するための下準備を実行
```
cdk bootstrap
```

### 環境変数設定
- `stack/config/example.ts`をコピーして必要な値を設定

### デプロイ
```
cdk deploy
```

###　参考
ECSとECRのコンテナ構成をCDKで実装してみた
https://dev.classmethod.jp/articles/cdk-ecs-ecr/