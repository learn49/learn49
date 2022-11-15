import { Account } from '../account.entity';

export interface IAccountRepository {
  findOneBySubdomain(subdomain: string): Promise<Account | undefined>;
  findOneById(id: string): Promise<Account | undefined>;
  create(subdomain: string): Promise<Account>;
  save(args: Account): Promise<Account>;
}
