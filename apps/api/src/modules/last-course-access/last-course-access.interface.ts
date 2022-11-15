import { LastCourseAccess } from './last-course-access.entity';

export interface FindOneArgs {
  accountId: string;
  userId: string;
  courseId: string;
}
export interface ILastCourseAccess {
  findOne(args: FindOneArgs): Promise<LastCourseAccess>;
}
