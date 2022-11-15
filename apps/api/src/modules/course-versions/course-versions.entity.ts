import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('course_versions')
export class CourseVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', nullable: false })
  courseId: string;

  @Column({ name: 'account_id', nullable: false })
  accountId: string;

  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'internal_notes', nullable: true })
  internalNotes: string;

  @Column({ name: 'allow_buy', nullable: true })
  allowBuy: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateGuid() {
    this.id = uuid();
  }
}
