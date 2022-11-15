export type CreateEnrollmentArgs = {
  accountId: string;
  userId: string;
  studentId: string;
  courseId: string;
  courseVersionId: string;
  startDate: Date;
  endDate?: Date;
  type: string;
};
