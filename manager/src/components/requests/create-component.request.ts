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

  @IsBoolean()
  @ApiProperty({
    description:
      'This flag is used to determine whether the component is shared. ' +
      'Usually, this flag is used to mark the component as a sensor. ' +
      'The component that only emits/reports data but not receiving anything back.',
    default: false,
    required: false,
    type: Boolean,
  })
  shared: boolean = false;
}
