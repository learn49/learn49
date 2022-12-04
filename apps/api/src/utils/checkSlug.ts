import { AppExceptions } from '@/utils/AppExceptions';
import slugify from 'slugify';

export type CheckSlug = {
  url: string;
  accountId: string;
  repository: any;
};

export const checkSlug = async ({
  url,
  accountId,
  repository,
}: CheckSlug): Promise<string> => {
  if (!url) throw AppExceptions.SlugInvalid;
  const slug = slugify(url.toLowerCase());
  const isExists = await repository.findOne({
    slug,
    accountId,
  });
  if (isExists) throw AppExceptions.SlugInvalid;
  return slug;
};
