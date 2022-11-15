import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('thread_answers')
export class ThreadAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id', nullable: false })
  accountId: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'thread_id', nullable: false })
  threadId: string;

  @Column({ name: 'is_answer', nullable: false })
  isAnswer: boolean;

  @Column({ name: 'is_internal_note', nullable: true })
  isInternalNote: boolean;

  @Column({ type: 'jsonb', name: 'body', nullable: false })
  body: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateGuid() {
    this.id = uuid();
  }
}
