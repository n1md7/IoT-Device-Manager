import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComponentRequest {
  @IsString()
  @ApiProperty({
    description: 'The Device Code of the component.',
    required: true,
    type: String,
    example: 'D0001',
  })
  deviceCode!: string;

  @IsNumber()
  @ApiProperty({
    description: 'The System ID of the component type.',
    required: true,
    type: Number,
    example: 1,
  })
  systemId!: number;
}
