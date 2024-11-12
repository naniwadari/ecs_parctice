FROM node:22.11.0

RUN npm install -g aws-cdk

RUN apt-get update
RUN apt-get install -y sudo vim ca-certificates curl gnupg lsb-release

# Dockerのインストール(https://matsuand.github.io/docs.docker.jp.onthefly/engine/install/debian/)
# Dockerの公式GPG鍵を追加
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
# 安定版(stable)のリポジトリをセットアップ
RUN echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN sudo apt-get update
RUN sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# aws-cliのインストール(https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html)
WORKDIR /usr/local
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install | echo

RUN mkdir /root/.aws

RUN mkdir /cdk
WORKDIR /cdk