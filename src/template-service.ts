import {DynamoTable} from "@hexlabs/dynamo-ts";
import {DynamoDB} from "aws-sdk";
import * as tables from './tables';

export class TemplateService {
  constructor(
    tableName: string,
    dynamo: DynamoDB.DocumentClient,
    public readonly table = DynamoTable.build(tableName, dynamo, tables.templateTable)
  ) {}
}
