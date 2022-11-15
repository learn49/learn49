export interface FindAllCourseVersionArgs {
  whereRaw?: string;
  accountId?: string;
  courseId?: string;
  limit?: number;
  offset?: number;
  order?: {
    createdAt?: 'DESC' | 'ASC';
  };
}
