import {defineTable} from "@hexlabs/dynamo-ts";

export const templateTable = defineTable({
  definition: {
    identifier: 'string',
    name: 'string'
  },
  hashKey: 'identifier'
});
