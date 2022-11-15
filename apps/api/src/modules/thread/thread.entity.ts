import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('threads')
export class Thread {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id', nullable: false })
  accountId: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'course_id', nullable: true })
  courseId: string;

  @Column({ name: 'lesson_id', nullable: true })
  lessonId: string;

  @Column({ name: 'module_id', nullable: true })
  moduleId: string;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'body', nullable: false })
  body: string;

  @Column({ type: 'jsonb', name: 'tags', nullable: true })
  tags: string;

  @Column({ name: 'is_solved', nullable: false })
  isSolved: boolean;

  @Column({ name: 'is_ticket', nullable: false })
  isTicket: boolean;

  @Column({ name: 'is_pinned', nullable: false })
  isPinned: boolean;

  @Column({ name: 'is_closed', nullable: false })
  isClosed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateGuid() {
    this.id = uuid();
  }
}
