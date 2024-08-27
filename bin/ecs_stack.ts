#!/usr/bin/env node
import "source-map-support"
import * as Cdk from "aws-cdk-lib"
import { EcsStack } from "../stack/ecs_stack"
import { config } from "../stack/config/test"

const app = new Cdk.App()
new EcsStack(app, config.stackName, {
  env: {
    account: config.account,
    region: config.region,
  }
})