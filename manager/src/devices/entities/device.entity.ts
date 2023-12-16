import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Devices' })
export class Device {
  @PrimaryGeneratedColumn()
  id!: number;

  @Generated('uuid')
  @Column({ type: 'uuid' })
  uuid!: string;

  @Column({ type: 'varchar', length: 5, unique: true })
  @Index({ unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 32 })
  type!: string;

  @Column({ type: 'varchar', length: 64 })
  name!: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 2 })
  version!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
