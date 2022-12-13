export type UpdateArgs = {
  accountId: string;
  userId: string;
  lessonId: string;
  title?: string;
  blocks?: string;
  releaseOnDate?: Date;
  status?: string;
  releaseAfter?: number;
  slug?: string;
  description?: string;
  duration?: string;
};
