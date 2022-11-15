export interface CreatCourseVersionArgs {
  id?: string;
  accountId: string;
  courseId: string;
  name: string;
  description?: string;
  allowBuy?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
