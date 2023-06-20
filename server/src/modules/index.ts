import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import UploadFileModule from './upload/model.module';
import ModelModule from './example/model.module';
import ChatGptModule from './chatgpt/model.module';
export default [
  UploadFileModule,
  ChatGptModule,
  // UserModule,
  // RoleModule,
  // AuthModule,
  // ModelModule,
];
