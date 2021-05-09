import Environment from "@hexlabs/env-vars-ts";
import {Template} from "@hexlabs/kloudformation-ts";
import {CodeProps} from "@hexlabs/kloudformation-ts/dist/aws/lambda/function/CodeProps";
import {AWS} from "@hexlabs/kloudformation-ts/dist/kloudformation/aws";
import {Api} from "@hexlabs/kloudformation-ts/dist/kloudformation/modules/api";
import {Lambda} from "@hexlabs/kloudformation-ts/dist/kloudformation/modules/lambda";
import apiPaths from '../generated/template-service-api/paths.json';

type StackEnvs = {
  ENVIRONMENT: string;
}

const environment = Environment.fromProcess<StackEnvs>({
  requiredDefaults: {
    ENVIRONMENT: 'dev',
  }
}).environment;

const domain = 'api.com';
const envName = environment.ENVIRONMENT;
const production = envName === 'prod';
const api = (production ? '' : `${envName}.`) + `api.${domain}`;
const basePath = "template"

function templateLambda(aws: AWS, code: CodeProps): Lambda {
  return Lambda.create(aws, `klouds-accounts-api-${envName}`, code, 'bundle.handler', "nodejs14.x", {
    memorySize: 512,
    timeout: 30,
    environment: { variables: {
        HOST: `https://${api}`,
        BASE_PATH: `/${basePath}`,
      }}
  });
}

function templateApi(aws: AWS, lambda: Lambda): Api {
  return Api.create(aws, `klouds-accounts-${envName}`, envName, [], lambda.lambda.attributes.Arn)
  .mapTo(basePath, api)
  .apiFrom(apiPaths as any);
}

export default Template.createWithParams({
  CodeBucket: { type: 'String' },
  CodeLocation: { type: 'String' },
}, (aws, params) => {
  const codeLocation = {s3Bucket: params.CodeBucket(), s3Key: params.CodeLocation()};
  const lambda = templateLambda(aws, codeLocation);
  const api = templateApi(aws, lambda);
  return {
    apis: [api.definition()]
  }
});
