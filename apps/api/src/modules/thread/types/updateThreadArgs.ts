export type UpdateThreadArgs = {
  accountId: string;
  threadId: string;
  userId: string;
  role: string;
  title: string;
  body: string;
  tags: string;
  isClosed: boolean;
  isTicket: boolean;
  isSolved: boolean;
  isPinned: boolean;
};
