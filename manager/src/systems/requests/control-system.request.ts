import { Action } from '/src/systems/enum/action.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsInt, ValidateIf, ValidateNested } from 'class-validator';
import { SystemTime } from '/src/systems/requests/properties/system-time.property';
import { Type } from 'class-transformer';

export class ControlSystemRequest {
  @ApiProperty({
    example: 1,
    type: Number,
    description: 'System ID',
  })
  @IsInt()
  id!: number;

  @ApiProperty({
    enum: Action,
    example: Action.START,
    description: 'Action to perform',
  })
  @IsEnum(Action)
  action!: Action;

  @ApiProperty({
    type: SystemTime,
    description: 'Time to run the system. Only required when action is START',
    required: false,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => SystemTime)
  @ValidateIf(({ action }) => action === Action.START)
  duration?: SystemTime;

  startRequested(): this is { duration: SystemTime } {
    return this.action === Action.START;
  }

  stopRequested() {
    return this.action === Action.STOP;
  }
}
