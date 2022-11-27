import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  // ManyToOne,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

// import { Course } from '@/modules/courses/courses.entity';

@Entity('course_lessons')
export class CourseLesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'course_id' })
  courseId: string;

  @Column({ name: 'course_version_id' })
  courseVersionId: string;

  @Column({ name: 'module_id' })
  moduleId: string;

  @Column({ type: 'int', name: 'sort_order' })
  sortOrder: number;

  @Column({ name: 'base_lesson_id' })
  baseLessonId: string;

  @Column({ nullable: true })
  type: string;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  blocks: string;

  @Column({ default: 'draft' })
  status: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ name: 'release_on_date', nullable: true })
  releaseOnDate: Date;

  @Column({ name: 'release_after', nullable: true })
  releaseAfter: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  // @ManyToOne(
  //   () => Courses,
  //   couse => couse.courseLessons,
  // )
  // course: Courses;

  @BeforeInsert()
  generateId() {
    this.id = uuid();
  }
}
