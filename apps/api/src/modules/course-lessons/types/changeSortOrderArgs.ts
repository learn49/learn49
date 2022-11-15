import { NewLessonSortOrderInput } from '../dto/newLessonSortOrder.input';

export type ChangeSortOrderArgs = {
  accountId: string;
  userId: string;
  courseId: string;
  courseVersionId: string;
  moduleId: string;
  lessons: NewLessonSortOrderInput[];
  baseId: string;
};
