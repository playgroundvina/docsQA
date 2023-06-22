import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import UploadFileModule from './upload/upload.module';
import ModelModule from './example/model.module';
import ChatGptModule from './chatgpt/chatgpt.module';
import testsseModule from './testsse/model.module';
export default [
  // testsseModule,
  UploadFileModule,
  ChatGptModule,
  UserModule,
  RoleModule,
  AuthModule,
  // ModelModule,
];
