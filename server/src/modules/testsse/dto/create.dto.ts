import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

class CreateModelDto {
  @IsString()
  @ApiProperty({
    example: 'name',
    description: 'what is name?',
  })
  readonly name: string;

  @IsNumber()
  @ApiProperty({
    example: '111',
    description: 'Is The prop1 type number?',
  })
  readonly prop1: number;
}

export default CreateModelDto;
