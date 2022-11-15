import { Label } from '../repositories/course-repository.interface';

export type CourseArgs = {
  userId: string;
  accountId: string;
  title: string;
  description: string;
  versionName: string;
  labels: Label[];
};
