import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength } from 'class-validator';

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
    description: 'The cron expression of the schedule.',
  })
  @IsString()
  @MaxLength(32)
  expression!: string;

  @ApiProperty({
    type: Number,
    example: 5,
    description: 'The number of times the schedule will run. -1 means infinite. It will be removed after the last run.',
  })
  @IsInt()
  removeAfterCount!: number;
}
