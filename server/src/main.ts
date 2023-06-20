import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import * as AppMiddleware from './middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'debug'],
  });
  const configService = app.get(ConfigService);
  const PORT: number = Number.parseInt(
    configService.get<string>('APP_PORT') ?? '3000',
  );

  // Middleware
  AppMiddleware.enableMyCors(app);
  // AppMiddleware.enableMyHelmet(app);
  AppMiddleware.enableMyMorgan(app);
  AppMiddleware.enableMySwagger(app);

  await app.listen(PORT, async () => {
    console.log(`Application is running on: ${await app.getUrl()}/docs`);
  });
}
bootstrap();
