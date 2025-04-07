import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateComponentRequest } from '/src/components/requests/create-component.request';
import { IsBoolean } from 'class-validator';

export class UpdateComponentRequest extends PartialType(CreateComponentRequest) {
  @IsBoolean()
  @ApiProperty({
    description: 'This flag is used to determine whether the component is in use.',
    default: false,
    required: false,
    type: Boolean,
  })
  inUse: boolean = false;
}
