import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { MediaFile } from '../media-file/media-file.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'friendly_name', nullable: true })
  friendlyName: string;

  @Column()
  subdomain: string;

  @Column({ type: 'jsonb', nullable: true })
  domains: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'recaptcha_site_key', nullable: true })
  recaptchaSiteKey: string;

  @Column({ name: 'recaptcha_secret', nullable: true })
  recaptchaSecret: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => MediaFile,
    mediaFile => mediaFile.account,
  )
  mediaFiles: MediaFile[];

  @BeforeInsert()
  generateId() {
    this.id = uuid();
  }
}
