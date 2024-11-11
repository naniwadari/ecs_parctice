#!/usr/bin/env node
import "source-map-support"
import * as Cdk from "aws-cdk-lib"
import { EcsStack } from "../stack/ecs_stack"

const env = process.env.CDK_ENV
const config = require("../stack/config/" + env).config
console.log(`env: ${env} deploy start`)

const app = new Cdk.App()
new EcsStack(app, config.stackName, {
  env: {
    account: config.account,
    region: config.region,
  }
})