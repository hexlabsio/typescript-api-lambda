import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {TemplateServiceApi} from "../generated/template-service-api/api";
import schema from "./schema";

export class TemplateApi extends TemplateServiceApi<APIGatewayProxyEvent, APIGatewayProxyResult, 'admin' | 'write' | 'read'> {
  getSchemaHandler = async () => {
    return { statusCode: 200, body: JSON.stringify(schema) };
  }
}
