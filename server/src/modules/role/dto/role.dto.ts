import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @ApiProperty({
    example: 'admin|user',
    description: 'The name of the role',
  })
  readonly name: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsString()
  @ApiProperty({
    example: 'admin|user',
    description: 'The name of the role',
  })
  readonly name: string;
}
