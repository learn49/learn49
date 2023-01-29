import { Label } from '../repositories/course-repository.interface';

export type UpdateArgs = {
  userId: string;
  accountId: string;
  courseId: string;
  title?: string;
  description?: string;
  image?: string;
  videoPreview?: string;
  defaultVersion?: string;
  labels: Label[];
  slug?: string;
  duration?: string;
  relatedCourses?: string[];
  nextUpCourses?: string[];
  requiredCourses?: string[];
};
