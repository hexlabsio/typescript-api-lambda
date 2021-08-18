import {defineEnvironmentFromProcess} from "@hexlabs/env-vars-ts";
import {Template} from "@hexlabs/kloudformation-ts";
import {Table} from "@hexlabs/kloudformation-ts/dist/aws/dynamodb/Table";
import {CodeProps} from "@hexlabs/kloudformation-ts/dist/aws/lambda/function/CodeProps";
import {AWS} from "@hexlabs/kloudformation-ts/dist/kloudformation/aws";
import {Api} from "@hexlabs/kloudformation-ts/dist/kloudformation/modules/api";
import {dynamoTable, grantTableAccess} from "@hexlabs/kloudformation-ts/dist/kloudformation/modules/dynamo";
import {Lambda} from "@hexlabs/kloudformation-ts/dist/kloudformation/modules/lambda";
import apiPaths from '../generated/template-service-api/paths.json';
import * as tables from '../src/tables';

const {environment} = defineEnvironmentFromProcess(['ENVIRONMENT'] as const, [], {ENVIRONMENT: 'dev'});

const domain = 'klouds.io';
const envName = environment.ENVIRONMENT;
const production = envName === 'prod';
const api = `api.${production ? '' : `${envName}.`}${domain}`;
const allowedOrigin = 'https://' + (production ? '' : `${envName}.`) + domain

const basePath = "views"

function templateLambda(aws: AWS, code: CodeProps, templateTable: Table): Lambda {
  return Lambda.create(aws, `klouds-accounts-api-${envName}`, code, 'bundle.handler', "nodejs14.x", {
    memorySize: 512,
    timeout: 30,
    environment: { variables: {
        HOST: `https://${api}`,
        BASE_PATH: `/${basePath}`,
        ALLOWED_ORIGIN: allowedOrigin,
        TEMPLATE_TABLE: templateTable
      }}
  });
}

function templateApi(aws: AWS, lambda: Lambda): Api {
  return Api.create(aws, `klouds-template-${envName}`, envName, [], lambda.lambda.attributes.Arn)
  .mapTo(basePath, api)
  .apiFrom(apiPaths);
}

export default Template.createWithParams({
  CodeBucket: { type: 'String' },
  CodeLocation: { type: 'String' },
}, (aws, params) => {
  const codeLocation = {s3Bucket: params.CodeBucket(), s3Key: params.CodeLocation()};
  const templateTable = dynamoTable(aws, tables.templateTable, `template-table-${envName}`, {billingMode: 'PAY_PER_REQUEST'})
  const lambda = templateLambda(aws, codeLocation, templateTable);
  grantTableAccess(lambda.role, 'TableAccess', [templateTable]);
  const api = templateApi(aws, lambda);
  return {
    apis: [api.definition()]
  }
});
