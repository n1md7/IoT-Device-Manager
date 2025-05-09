import { IsDefined, IsInt, IsString, MaxLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SystemTime } from '/src/systems/requests/properties/system-time.property';

export class CreateScheduleRequest {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'The unique identifier of the system.',
  })
  @IsInt()
  systemId!: number;

  @ApiProperty({
    type: String,
    example: 'Timer schedule',
    description: 'The name of the schedule.',
  })
  @IsString()
  @MaxLength(32)
  name!: string;

  @ApiProperty({
    type: String,
    example: '5 * * * * *',
    description: 'The cron expression of the schedule to START.',
  })
  @IsString()
  @MaxLength(32)
  startExpression!: string;

  @ApiProperty({
    type: SystemTime,
    example: {
      min: 10,
      sec: 0,
    },
    description: 'Duration of the component to run.',
  })
  @ValidateNested()
  @IsDefined()
  @Type(() => SystemTime)
  duration!: SystemTime;
}
