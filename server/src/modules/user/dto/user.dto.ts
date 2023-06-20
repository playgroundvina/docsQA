import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    example: 'Nguyen Anh Nam',
    description: 'The name of the user',
  })
  fullName: string;

  @IsString()
  @ApiProperty({
    example: 'Admin | User',
    description: 'The role of the user',
  })
  role: string;

  @IsString()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'The email of the user',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'abc123@oke',
    description: 'The password of the user',
  })
  password: string;

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

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @ApiProperty({
    example: 'user1oke23',
    description: 'The username of the user',
  })
  readonly username: string;
}
