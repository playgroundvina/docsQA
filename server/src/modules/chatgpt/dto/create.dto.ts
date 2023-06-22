import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

class CreateModelDto {
  @IsString()
  @ApiProperty({
    example: 'hãy tóm tắt nội dung chính',
    description: 'enter content ',
    required: true,
  })
  content: string;
  @IsString()
  @ApiProperty({
    example: 'vietnamese',
    description: 'enter language ',
    required: false,
  })
  language: string;

}

export default CreateModelDto;
