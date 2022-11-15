import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('course_versions')
export class CourseVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id', nullable: true })
  accountId: string;

  @Column({ name: 'course_id', nullable: true })
  courseId: string;

  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'allow_buy', nullable: true })
  allowBuy: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }

  @BeforeInsert()
  generateGuid() {
    this.id = uuid();
  }
}
