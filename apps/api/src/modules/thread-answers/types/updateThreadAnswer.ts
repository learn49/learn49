export type UpdateThreadAnswer = {
  accountId: string;
  userId: string;
  role: string;
  threadId: string;
  threadAnswerId: string;
  body?: string;
  isAnswer?: boolean;
};
