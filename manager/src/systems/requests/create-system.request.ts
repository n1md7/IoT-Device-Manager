import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsString, MaxLength } from 'class-validator';

export class CreateSystemRequest {
  @ApiProperty({
    type: String,
    example: 'Watering System',
    description: 'The name of the system.',
  })
  @IsString()
  @MaxLength(64)
  name!: string;

  @ApiProperty({
    type: String,
    example: 'A watering system. It waters plants.',
    description: 'The description of the system.',
  })
  @IsString()
  @MaxLength(256)
  description?: string;
}
