import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export abstract class AbstractRequest {
  @ApiProperty({
    type: String,
    example: 'D0001',
    description: 'The unique identifier of the device.',
  })
  @IsString()
  @MaxLength(5)
  code!: string;

  @ApiProperty({
    type: String,
    example: 'Timer',
    description: 'The name of the device.',
  })
  @IsString()
  @MaxLength(64)
  name!: string;

  @ApiProperty({
    type: String,
    example: '1',
    examples: ['1', '2', '3'],
    description: 'The version of the device.',
  })
  @IsString()
  @MaxLength(2)
  version!: string;
}
