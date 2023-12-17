import { Action } from '/src/systems/enum/action.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt } from 'class-validator';

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
}
