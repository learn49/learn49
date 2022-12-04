import { AppExceptions } from '@/utils/AppExceptions';
import slugify from 'slugify';

export type CheckSlug = {
  title: string;
  accountId: string;
  repository: any;
};

export const checkSlug = async ({
  title,
  accountId,
  repository,
}: CheckSlug): Promise<string> => {
  if (!title) throw AppExceptions.SlugInvalid;
  const slug = slugify(title.toLowerCase());
  const isExists = await repository.findOne({
    slug,
    accountId,
  });
  if (isExists) throw AppExceptions.SlugInvalid;
  return slug;
};
