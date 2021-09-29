import {defineEnvironmentFromProcess} from "@hexlabs/env-vars-ts";
import {allFilters} from "@hexlabs/http-api-ts";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from "aws-lambda";
import {DynamoDB} from "aws-sdk";
import {TemplateApi} from "./template-api";
import {TemplateService} from "./template-service";


const {environment} = defineEnvironmentFromProcess(['HOST', 'BASE_PATH', 'ALLOWED_ORIGIN', 'TEMPLATE_TABLE'] as const, []);

export const handler: Handler = async event => {
  const service = new TemplateService(environment.TEMPLATE_TABLE, new DynamoDB.DocumentClient());
  const handler = new TemplateApi(environment.HOST, environment.BASE_PATH, service);
  return allFilters<APIGatewayProxyEvent, APIGatewayProxyResult>(handler.version, {origins: [environment.ALLOWED_ORIGIN], headers: '*', methods: '*'})(handler.routes())(event);
};
