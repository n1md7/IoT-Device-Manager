import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Component } from '/src/components/entities/component.entity';
import { ApiProperty } from '@nestjs/swagger';
import { DeviceType } from '/src/devices/enums/type.enum';

@Entity({ name: 'Devices' })
export class Device {
  @ApiProperty({
    type: String,
    example: 'D0001',
    description: 'The unique identifier of the device.',
  })
  @PrimaryColumn({ type: 'varchar', length: 8 })
  code!: string;

  @ApiProperty({
    enum: DeviceType,
    example: DeviceType.SWITCH,
    description: 'The type of the device. This will be used to determine the configuration of the device',
  })
  @Column({ type: 'varchar' })
  type!: DeviceType;

  @ApiProperty({
    type: String,
    example: 'Timer',
    description: 'The name of the device.',
  })
  @Column({ type: 'varchar', length: 64 })
  name!: string;

  @ApiProperty({
    type: String,
    example: 'A timer device.',
    description: 'The description of the device.',
  })
  @Column({ type: 'varchar', length: 256, nullable: true })
  description?: string;

  @ApiProperty({
    type: String,
    example: '1',
    description: 'The version of the device.',
  })
  @Column({ type: 'varchar', length: 2 })
  version!: string;

  @ApiProperty({
    isArray: true,
    type: Component,
  })
  @OneToMany(() => Component, (component) => component.device, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  components!: Component[];

  @ApiProperty({
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
    description: 'The date(ISO 8601) when the device was registered.',
  })
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @ApiProperty({
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
    description: 'The date(ISO 8601) when the device was last updated.',
  })
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
