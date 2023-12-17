import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Device } from '/src/devices/entities/device.entity';
import { System } from '/src/systems/entities/system.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'Components' })
export class Component {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    type: Number,
    description: 'The unique identifier of the component.',
  })
  id!: number;

  @ApiProperty({
    type: Boolean,
    description: 'This flag is used to determine whether the component can be used by multiple systems.',
  })
  @Column({ type: 'boolean', default: false })
  /**
   * Sensors can be shared with multiple systems.
   * While standalone components can only be used by one system.
   *
   * For example, a liquid level sensor can be shared with multiple systems.
   * While an electrical valve cannot be used by another system.
   * It can simply cause conflicts.
   * Because one system may open the valve while the other system closes it.
   *
   * This flag is used to determine whether the component can be used by multiple systems.
   *
   * It will be ignored when the component is marked as "shared".
   */
  inUse!: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'This flag is used to determine whether the component is shared. ',
  })
  @Column({ type: 'boolean', default: false })
  /**
   * This flag is used to determine whether the component is shared.
   * Usually, this flag is used to mark the component as a sensor.
   * The component that only emits/reports data but not receiving anything back.
   */
  shared!: boolean;

  @ManyToOne(() => Device, (device) => device.components)
  @JoinColumn({ name: 'deviceCode', referencedColumnName: 'code' })
  device!: Device;

  @ManyToOne(() => System, (system) => system.components)
  @JoinColumn({ name: 'systemId', referencedColumnName: 'id' })
  system!: System;

  @ApiProperty({
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
    description: 'The date(ISO 8601) when the component was created.',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty({
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
    description: 'The date(ISO 8601) when the component was last updated.',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
