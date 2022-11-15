import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('extensions')
export class Extension {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'developer_id', nullable: true })
  developerId: string;

  @Column({ name: 'version', nullable: true })
  version: number;

  @Column({ type: 'jsonb', name: 'permissions', nullable: true })
  permissions: string;

  @Column({ type: 'jsonb', name: 'settings', nullable: true })
  settings: string;

  @Column({ type: 'jsonb', name: 'scopes', nullable: true })
  scopes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateGuid() {
    this.id = uuid();
  }
}
