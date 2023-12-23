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
