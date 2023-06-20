import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthService } from '../auth.service';
import { AppResponse } from 'src/shared/services/response-status';
import { User } from 'src/modules/user/schema/user.schema';
import { Role } from 'src/modules/role/schema/role.schema';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (token && token.split(' ')[1]) {
      try {
        const userDecode = await this.authService.decodeTokenJWT(
          token.split(' ')[1],
        );
        if (!userDecode) {
          return AppResponse.tokenExpired('Auth Guard');
        }
        const { userId, roleId } = userDecode;
        const user = await this.authService.findUserById(userId);
        if (!user) {
          return AppResponse.notFound(User.name, 'id', userId);
        }
        const role = await this.authService.findRoleById(roleId);
        if (!role) {
          return AppResponse.notFound(Role.name, 'id', roleId);
        }
        /**
         * (*): Về cơ bản user.role trả về là một obj (do populate bảng Role), nhưng trong schema thì role được khai báo là kiểu string.
         * => Giải pháp:
         *  - Gán type {_id, name} cho trường role trong UserSchema
         *  - Cho kiểu trả về của các hàm findOneById đều là any (đều này có thể không phù hợp với Typescript)
         */
        if (user._id.valueOf() === userId && role.name === user.role.name) {
          request.user = {
            id: user._id,
            fullName: user.fullName,
            role: user.role.name,
          };
          return true;
        }
        return AppResponse.notAcceptable('Auth Guard');
      } catch (error) {
        console.log('error: ', error);
        if (error instanceof TokenExpiredError) {
          return AppResponse.tokenExpired('Auth Guard');
        }
      }
    }
    return AppResponse.unauthorized('Auth Guard'); // success
  }
}
