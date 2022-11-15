import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Course } from '../courses/courses.entity';

@Entity('labels')
export class Label {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'label', nullable: false })
  label: string;

  @Column({ name: 'is_private', nullable: true })
  isPrivate: boolean;

  @Column({ name: 'account_id', nullable: false })
  accountId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /*  @ManyToMany(() => Course)
  @JoinTable()
  courses: Course[]; */

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
