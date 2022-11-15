export type CreateThreadAnswerArgs = {
  accountId: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  threadId: string;
  body: string;
  isInternalNote: boolean;
};
