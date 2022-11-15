import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('offer_courses')
export class OfferCourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id', nullable: false })
  accountId: string;

  @Column({ name: 'offer_id', nullable: false })
  offerId: string;

  @Column({ name: 'course_id', nullable: false })
  courseId: string;

  @Column({ name: 'settings_type', nullable: false })
  settingsType: string;

  @Column({ name: 'settings_version_id', nullable: true })
  settingsVersionId: string;

  @Column({ name: 'settings_period', nullable: false })
  settingsPeriod: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateGuid() {
    this.id = uuid();
  }
}
