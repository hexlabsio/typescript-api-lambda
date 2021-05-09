import {OAS} from '@hexlabs/schema-api-ts/dist/oas';

const templateApiSpec: OAS = {
  openapi: '3.0.0',
  info: {
    title: 'Template Service Api',
    version: '1.0',
  },
  paths: {
    '/abc': {
      get: {
        responses: {
          '200': {
            description: 'Template GET request',
            content: {'application/json': {schema: {'$ref': '#/components/schemas/Abc'}}}
          }
        }
      }
    },
    '/schema': {
      get: {
        responses: {
          '200': {
            description: 'Open API 3 Specification for this Service',
            content: {'application/json': {schema: {type: 'object'}}}
          }
        }
      }
    }
  },
  components: {
    schemas: {
      'Abc': {
        type: 'object',
        title: 'Abc',
        required: ['a'],
        additionalProperties: false,
        properties: {
          a: { type: 'string' },
          b: { type: 'number' },
          c: { type: 'boolean' }
        }
      }
    }
  }
};

export default templateApiSpec;
