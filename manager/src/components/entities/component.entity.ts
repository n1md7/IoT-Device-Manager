import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Device } from '/src/devices/entities/device.entity';
import { System } from '/src/systems/entities/system.entity';

@Entity({ name: 'Components' })
export class Component {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @Column({ type: 'boolean', default: false })
  /**
   * This flag is used to determine whether the component is shared.
   * Usually, this flag is used to mark the component as a sensor.
   * The component that only emits/reports data but not receiving anything back.
   */
  shared!: boolean;

  @OneToOne(() => Device, (device) => device.components)
  @JoinColumn({ name: 'deviceCode', referencedColumnName: 'code' })
  device!: Device;

  @OneToOne(() => System, (system) => system.components)
  @JoinColumn({ name: 'systemId', referencedColumnName: 'id' })
  system!: System;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
