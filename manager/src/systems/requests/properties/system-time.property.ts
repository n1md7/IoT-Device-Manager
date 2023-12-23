import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class SystemTime {
  @ApiProperty({
    example: 15,
    type: Number,
    description: 'value of seconds. Only the seconds part of the time [0, 59]',
  })
  @IsInt()
  @Min(0)
  @Max(59)
  sec!: number;

  @ApiProperty({
    example: 15,
    type: Number,
    description: 'value of minutes. Only the minutes part of the time [0, 99]',
  })
  @IsInt()
  @Min(0)
  @Max(99)
  min!: number;

  getTotalSeconds() {
    return this.sec + this.min * 60;
  }
}
