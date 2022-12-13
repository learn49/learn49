import { Course } from '../courses.entity';

export interface Label {
  id?: string;
  label?: string;
  isPrivate?: boolean;
  accountId?: string;
}

export interface CreateCourseArgs {
  accountId: string;
  title: string;
  description: string;
  defaultVersion: string;
  createdAt: Date;
  updatedAt: Date;
  labels: Label[];
  slug: string;
}

export interface FindOneCourseArgs {
  id?: string;
  slug?: string;
  accountId?: string;
}

export interface FindAllCourseArgs {
  accountId?: string;
  offset?: number;
  limit?: number;
}

export interface ICourseRepository {
  create(args: CreateCourseArgs): Promise<Course>;
  findOne(args: FindOneCourseArgs): Promise<Course | undefined>;
  findAll(args: FindAllCourseArgs): Promise<Course[]>;
  count(accountId: string): Promise<number>;
  save(args: Course): Promise<Course>;
  remove(args: Course): Promise<void>;
}
