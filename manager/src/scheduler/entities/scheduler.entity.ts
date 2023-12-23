import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { System } from '/src/systems/entities/system.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'Schedules' })
export class Schedule {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'The unique identifier of the schedule.',
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    type: String,
    example: 'Timer',
    description: 'The name of the schedule.',
  })
  @Column({ type: 'varchar', length: 32 })
  name!: string;

  @ApiProperty({
    type: String,
    example: '5 * * * * *',
    description: 'The cron expression of the schedule to START.',
  })
  @Column({ type: 'varchar', length: 32 })
  startExpression!: string;

  @ApiProperty({
    type: String,
    example: '5 * * * * *',
    description: 'The cron expression of the schedule to STOP.',
  })
  @Column({ type: 'varchar', length: 32 })
  stopExpression!: string;

  @ApiProperty({
    type: Number,
    example: 5,
    description: 'The number of times the schedule will run. -1 means infinite. It will be removed after the last run.',
  })
  @Column({ type: 'integer', default: -1 })
  removeAfterCount!: number;

  @ApiProperty({
    type: System,
    isArray: true,
  })
  @ManyToOne(() => System, (system) => system.schedules)
  system!: System;
}
