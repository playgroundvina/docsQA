import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @ApiProperty({
    example: 'Nguyen Anh Nam',
    description: 'The name of the user',
  })
  readonly fullName: string;

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

  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: 'The gender of the user (true: male; false: female)',
  })
  gender: boolean;

  @IsNumber()
  @ApiProperty({
    example: '23',
    description: 'The age of the user',
  })
  age: number;
}
