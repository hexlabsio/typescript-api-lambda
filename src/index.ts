import {defineEnvironmentFromProcess} from "@hexlabs/env-vars-ts";
import {allFilters} from "@hexlabs/http-api-ts";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from "aws-lambda";
import {TemplateApi} from "./template-api";


const {environment} = defineEnvironmentFromProcess(['HOST', 'BASE_PATH', 'ALLOWED_ORIGIN'] as const, []);

export const handler: Handler = async event => {
  const handler = new TemplateApi(environment.HOST, environment.BASE_PATH);
  return allFilters<APIGatewayProxyEvent, APIGatewayProxyResult>(handler.version, {origins: [environment.ALLOWED_ORIGIN], headers: '*', methods: '*'})(handler.handle)(event);
};
