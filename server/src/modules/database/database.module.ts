import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoosePlugin } from './plugin/mongoose.plugin';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const databaseUri = configService.get<string>('DATABASE_URI');
        console.log(`Connected to database!`);
        return {
          connectionFactory: (connection: any) => {
            connection.plugin(MongoosePlugin.removeVersionFieldPlugin);
            return connection;
          },
          uri: databaseUri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
