import {TemplateServiceApi} from "../generated/template-service-api/api";
import schema from "./schema";

export class TemplateApi extends TemplateServiceApi {
  getSchemaHandler = async () => {
    return { statusCode: 200, body: JSON.stringify(schema) };
  }
}
