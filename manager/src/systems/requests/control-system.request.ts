import { Action } from '/src/systems/enum/action.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, ValidateIf, ValidateNested } from 'class-validator';
import { SystemTime } from '/src/systems/requests/properties/system-time.property';

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
  @ValidateNested()
  @ValidateIf(({ action }) => action === Action.START)
  time?: SystemTime;

  startRequested(): this is { time: SystemTime } {
    return this.action === Action.START;
  }

  stopRequested() {
    return this.action === Action.STOP;
  }
}
