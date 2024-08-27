# ecs_parctice

## スタートガイド

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

###　参考
ECSとECRのコンテナ構成をCDKで実装してみた
https://dev.classmethod.jp/articles/cdk-ecs-ecr/