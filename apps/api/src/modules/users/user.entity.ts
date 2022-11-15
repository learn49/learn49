import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ type: 'jsonb', nullable: true })
  identifiers: string;

  @Column({ name: 'profile_picture', nullable: true })
  profilePicture: string;

  @Column({ type: 'jsonb' })
  emails: {
    email: string;
    verified: boolean;
    main: boolean;
  }[];

  @Column()
  passwd: string;

  @Column({ nullable: true })
  timezone: number;

  @Column({ default: false })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @BeforeInsert()
  generateGuid() {
    this.id = uuid();
  }
}
