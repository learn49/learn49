import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('extension_installations')
export class ExtensionInstallation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'extension_id', nullable: false })
  extensionId: string;

  @Column({ name: 'account_id', nullable: false })
  accountId: string;

  @Column({ name: 'active', nullable: true })
  active: boolean;

  @Column({ type: 'jsonb', name: 'settings_values', nullable: true })
  settingsValues: any;

  @Column({ type: 'jsonb', name: 'permission_values', nullable: true })
  permissionValues: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateGuid() {
    this.id = uuid();
  }
}
