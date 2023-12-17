import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Component } from '/src/components/entities/component.entity';

@Entity({ name: 'Devices' })
export class Device {
  @PrimaryColumn({ type: 'varchar', length: 8 })
  code!: string;

  @Column({ type: 'varchar', length: 32 })
  type!: string;

  @Column({ type: 'varchar', length: 64 })
  name!: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 2 })
  version!: string;

  @OneToMany(() => Component, (component) => component.device, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  components!: Component[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
