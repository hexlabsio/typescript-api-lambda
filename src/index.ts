import {combineFilters, consoleLoggingFilter, Filter} from "@hexlabs/apigateway-ts";
import Environment from "@hexlabs/env-vars-ts";
import { Handler} from "aws-lambda";
import {TemplateApi} from "./template-api";


type TemplateEnvs = {
  HOST: string;
  BASE_PATH: string;
}

const environment = Environment.fromProcess<TemplateEnvs>(
  {
    requiredDefaults: {
      HOST: undefined,
      BASE_PATH: undefined
    }
  }
);

const jsonContentType: Filter = next => async event => {
  const response = await next(event);
  return {
    ...response,
    headers: { ...response.headers, 'Content-Type': 'application/json' }
  }
}

export const handler: Handler = async event => {
  environment.printEnvironment();
  const handler = new TemplateApi();
  return combineFilters([consoleLoggingFilter, jsonContentType])!(handler.handle)(event);
};
