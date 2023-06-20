import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    RoleModule,
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const accessTokenKey = configService.get<string>(
          'JWT_ACCESS_TOKEN_SECRET',
        );
        const accessTokenExpirationTime = configService.get<string>(
          'JWT_ACCESS_TOKEN_SECRET',
        );
        return {
          secret: accessTokenKey,
          signOptions: {
            expiresIn: accessTokenExpirationTime,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
