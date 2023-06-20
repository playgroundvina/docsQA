import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async sayHello(): Promise<string> {
    return 'Hello World!';
  }
}
