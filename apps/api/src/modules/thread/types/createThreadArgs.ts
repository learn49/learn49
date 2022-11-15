export type CreateThreadArgs = {
  accountId: string;
  userId: string;
  courseId?: string;
  lessonId?: string;
  moduleId: string;
  title: string;
  body: string;
  tags?: string;
  isTicket: boolean;
};
