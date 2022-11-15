import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id', nullable: false })
  accountId: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'notified_by', nullable: true })
  notifiedBy: string;

  @Column({ name: 'type', nullable: true })
  type: string;

  @Column({ name: 'message', nullable: true })
  message: string;

  @Column({ type: 'jsonb', name: 'data', nullable: true })
  data: {
    courseId: string;
    threadId: string;
    threadAnswerId: string;
  };

  @Column({ name: 'read', nullable: true })
  read: boolean;

  @CreateDateColumn({ name: 'read_at' })
  readAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateGuid() {
    this.id = uuid();
  }
}
