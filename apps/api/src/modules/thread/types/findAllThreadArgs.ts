export type FindAllThreadArgs = {
  limit: number;
  offset: number;
  accountId: string;
  courseId: string;
  lessonId: string;
  isTicket: boolean;
  filter: string;
  myTickets: boolean;
  userId: string;
  role: string;
  title: string;
};
