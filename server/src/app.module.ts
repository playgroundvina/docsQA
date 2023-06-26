import { Module } from '@nestjs/common';
import { join } from 'path';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config/dist';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './shared/services/http-exception-filter';
import { DatabaseModule } from './modules/database/database.module';
import APP_MODULES from 'src/modules';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env', '.development.env'], // https://docs.nestjs.com/techniques/configuration
      isGlobal: true,
    }),
    DatabaseModule,
    ...APP_MODULES,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule { }
