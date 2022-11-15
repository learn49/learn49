import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('extension_installations_webhooks')
export class ExtensionInstallationWebhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'installation_id' })
  installationId: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ type: 'jsonb' })
  payload: any;

  @Column({ nullable: true })
  response: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateGuid() {
    this.id = uuid();
  }
}
