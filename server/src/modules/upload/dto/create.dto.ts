import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

class CreateModelUploadFileDto {

  @ApiProperty({
    name: 'file',
    description: 'Chose file for upload',
    format: 'binary',
    required: true,
  })
  file: string;

  @IsString()
  @ApiProperty({
    name: 'owner',
    description: 'enter id user',
    required: true,
  })
  owner: string;

  @IsString()
  @ApiProperty({
    name: 'filename',
    description: 'enter name file',
    required: false,

  })
  filename: string;
}

export default CreateModelUploadFileDto;
