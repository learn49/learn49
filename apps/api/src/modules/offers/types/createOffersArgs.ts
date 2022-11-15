import { Courses } from './courses';

export type CreateOffersArgs = {
  accountId: string;
  extensionId: string;
  userId: string;
  name: string;
  type: string;
  price: string;
  sellPage: string;
  metadata: string;
  courses: Courses[];
};
