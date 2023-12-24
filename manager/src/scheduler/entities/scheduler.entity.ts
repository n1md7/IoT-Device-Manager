import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { System } from '/src/systems/entities/system.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SystemTime } from '/src/systems/requests/properties/system-time.property';

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
    type: SystemTime,
    example: {
      min: 10,
      sec: 0,
    },
    description: 'Duration how long the system has to run.',
  })
  @Column({ type: 'simple-json' })
  duration!: SystemTime;

  @ApiProperty({
    type: System,
    isArray: true,
  })
  @ManyToOne(() => System, (system) => system.schedules)
  system!: System;

  @ApiProperty({
    type: Date,
    description: 'The date and time the system was created.',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty({
    type: Date,
    description: 'The date and time the system was updated.',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
