import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Component } from '/src/components/entities/component.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ConflictException } from '@nestjs/common';
import { Schedule } from '/src/scheduler/entities/scheduler.entity';

@Entity({ name: 'Systems' })
export class System {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'The unique identifier of the system.',
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    type: String,
    example: 'Timer',
    description: 'The name of the system.',
  })
  @Column({ type: 'varchar', length: 64 })
  name!: string;

  @ApiProperty({
    type: String,
    example: 'A timer system.',
    description: 'The description of the system.',
  })
  @Column({ type: 'varchar', length: 256, nullable: true })
  description?: string;

  @ApiProperty({
    isArray: true,
    type: Component,
  })
  @OneToMany(() => Component, (component) => component.system, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  components!: Component[];

  @ApiProperty({
    isArray: true,
    type: Schedule,
  })
  @OneToMany(() => Schedule, (schedule) => schedule.system, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  schedules!: Schedule[];

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
