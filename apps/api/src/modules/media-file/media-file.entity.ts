import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from '../accounts/account.entity';

@Entity('media_files')
export class MediaFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column()
  url: string;

  @Column()
  size: number;

  @Column({ name: 'alt_text' })
  altText: string;

  @Column()
  label: string;

  @Column()
  filename: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(
    () => Account,
    account => account.mediaFiles,
  )
  @JoinColumn({ name: 'account_id' })
  account: Account;
}
