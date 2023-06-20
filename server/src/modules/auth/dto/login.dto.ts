import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'The email of the user',
  })
  readonly email: string;

  @IsString()
  @ApiProperty({
    example: 'abc123@oke',
    description: 'The password of the user',
  })
  readonly password: string;
}
