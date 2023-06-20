import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { APP_CONSTANT } from 'src/shared/constants/app.constant';
import APP_MODULES from 'src/modules';

export const SWAGGER_API_ROOT = 'docs';
export const SWAGGER_API_NAME = 'Simple Nest API';
export const SWAGGER_API_DESCRIPTION = 'Simple API Description';
export const SWAGGER_API_CURRENT_VERSION = '1.0';
export const SWAGGER_API_TITLE = 'API Documentation';


export const enableMySwagger = (app: INestApplication) => {
  const configs = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .setTitle(SWAGGER_API_TITLE)
    // .addTag(APP_CONSTANT.TAGS.AUTH.title, APP_CONSTANT.TAGS.AUTH.description)
    // .addTag(APP_CONSTANT.TAGS.USER.title, APP_CONSTANT.TAGS.USER.description)
    // .addTag(APP_CONSTANT.TAGS.ROLE.title, APP_CONSTANT.TAGS.ROLE.description)
    .addBearerAuth()
    .build();

  const options: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: -1,
      showCommonExtensions: true,
      showExtensions: true,
      deepLinking: true,
      filter: true,
      displayOperationId: false,
      defaultModelRendering: 'model',
      docExpansion: 'none',
      displayOperationDuration: true,
    },
  };

  const document: OpenAPIObject = SwaggerModule.createDocument(app, configs, {
    include: [...APP_MODULES],
  });
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document, options);
};
