import { UserRole } from '../user-role.entity';

export interface CreateArgs {
  accountId: string;
  userId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindOneByAccountIdAndUserIdArgs {
  accountId: string;
  userId: string;
}

export interface IUserRoleRepository {
  findOneByAccountIdAndUserId(
    args: FindOneByAccountIdAndUserIdArgs,
  ): Promise<UserRole | undefined>;
  create(args: CreateArgs): Promise<UserRole>;
  save(args: UserRole): Promise<UserRole>;
}
