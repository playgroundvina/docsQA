import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

class CreateModelDto {
  @IsString()
  @ApiProperty({
    description: 'enter content ',
  })
  readonly content: string;

}

export default CreateModelDto;
