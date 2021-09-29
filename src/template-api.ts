import {APIGatewayProxyEvent} from "aws-lambda";
import {TemplateServiceApi} from "../generated/template-service-api/api";
import schema from "./schema";
import {TemplateService} from "./template-service";

export class TemplateApi extends TemplateServiceApi<'admin' | 'write' | 'read'> {
  constructor(host: string, basepath: string, private readonly templateService: TemplateService) {
    super(host, basepath);
  }
  getTemplates = async () => {
    return  { statusCode: 200, body: JSON.stringify(await this.templateService.table.scan()) };
  }
  createTemplate = async (event: APIGatewayProxyEvent) => {
    const template = this.validateTemplate(event.body ?? '{}');
    await this.templateService.table.put(template, {});
    return  { statusCode: 201, body: JSON.stringify(template) };
  }
  getSchemaHandler = async () => {
    return { statusCode: 200, body: JSON.stringify(schema) };
  }
}
