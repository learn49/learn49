import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Label } from '../labels/label.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ name: 'video_preview', nullable: true })
  videoPreview: string;

  @Column({ name: 'default_version' })
  defaultVersion: string;

  @Column({ name: 'slug', nullable: true })
  slug: string;

  @Column({ name: 'duration', nullable: true })
  duration: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Label, { eager: true, cascade: true })
  @JoinTable({
    name: 'label_course',
    joinColumn: {
      name: 'course_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'label_id',
      referencedColumnName: 'id',
    },
  })
  labels: Label[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @BeforeInsert()
  generateId() {
    this.id = uuid();
  }
}
