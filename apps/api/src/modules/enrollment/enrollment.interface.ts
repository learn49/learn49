import { Course } from '../courses/courses.entity';
import { User } from '../users/user.entity';
import { Enrollment } from './enrollment.entity';

export interface CreateEnrollmentArgs {
  accountId: string;
  userId: string;
  courseId: string;
  courseVersionId: string;
  startDate: Date;
  endDate: Date;
  status: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindOneByArgs {
  userId: string;
  accountId: string;
  courseId: string;
}

export interface FindOneArgs {
  accountId: string;
  courseId: string;
}

export interface IEnrollmentRepository {
  create(args: CreateEnrollmentArgs): Promise<Enrollment>;
  findOneBy(args: FindOneByArgs): Promise<Enrollment>;
  find(args: FindOneArgs): Promise<Enrollment[] | User[] | Course[]>;
  save(args: Enrollment): Promise<Enrollment>;
}
