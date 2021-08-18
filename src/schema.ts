import {OASServer, SchemaBuilder, OpenApiSpecificationBuilder, OASSecurity} from '@hexlabs/schema-api-ts';

const servers: OASServer[] = [
  {
    url: 'https://api.{environment}.klouds.io/{basePath}',
    variables: { environment: { default: 'dev' },  basePath: { default: 'views' } }
  },
  {
    url: 'https://api.klouds.io/{basePath}',
    variables: { environment: { default: 'prod' },  basePath: { default: 'views' } }
  },
  {
    url: 'http://localhost:{port}', variables: {  environment: { default: 'local' }, port: { default: '3000' } }
  },
];
const builder = SchemaBuilder.create();
export const schemasComponent = builder
.add('HydraOperation', s => s.hydraOperation())
.add('Template', s => s.object({identifier: s.string(), name: s.string()}, undefined, false))
.add('TemplateResource', s => s.hydraResource('Template'))
.add('TemplateCollection', s => s.hydraCollection('TemplateResource'))
.build();

const securitySchemes = { OAuth: { type: 'oauth', flows: { authorizationCode: { authorizationUrl: '', scopes: { read: 'Read', write: 'Write', admin: 'Admin' }}} }};
const read: OASSecurity[] = [{OAuth: ['read', 'write', 'admin']}];
const write: OASSecurity[] = [{OAuth: ['write', 'admin']}];
// const admin: OASSecurity[] = [{OAuth: ['admin']}];

export const oasBuilder = OpenApiSpecificationBuilder.create(schemasComponent, { title: 'Template Service Api', version: '1.0' })
.add('servers', () => servers)
.addComponent('securitySchemes', () => securitySchemes)
.addComponent('responses', o => ({
  'BadRequest': {description: 'Bad Request', content: o.textContent('Bad Request')}
}))
.add('paths', o => ({
  '/template': {
    get: {
      operationId: 'getTemplate',
      security: read,
      responses: {
        200: {description: '', content: o.jsonContent('TemplateCollection')},
        400: o.responseReference('BadRequest')
      }
    },
    post: {
      operationId: 'createView',
      security: write,
      requestBody: { content: o.jsonContent('Template') },
      responses: {
        201: {description: '', content: o.jsonContent('TemplateResource')}
      }
    }
  },
  '/schema': {
    get: {
      security: read,
      responses: {
        200: {description: '', content: { 'application/json': { schema: builder.object()}}}}
    }
  },
}))

export default oasBuilder.build();
