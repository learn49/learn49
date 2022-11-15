import { Enrollment } from '@/modules/enrollment/enrollment.entity';

export type FindNextLessonArgs = {
  accountId: string;
  courseId: string;
  moduleId: string;
  sortOrder: number;
  enrollment: Enrollment;
  role: string;
};
