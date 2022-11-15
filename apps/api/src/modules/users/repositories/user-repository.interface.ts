import { UserRole } from '../user-role.entity';
import { User } from '../user.entity';

export interface CreateUserArgs {
  accountId: string;
  firstName?: string;
  lastName?: string;
  emails: {
    email: string;
    verified: boolean;
    main: boolean;
  }[];
  passwd: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindOneByAccountIdAndEmailArgs {
  accountId: string;
  email: string;
}

export interface FindOneByAccountIdAndUserIdArgs {
  accountId: string;
  userId: string;
}

export interface FindAllArgs {
  accountId: string;
  name?: string;
  limit: number;
  offset: number;
}

export interface IUserRepository {
  findOneByAccountIdAndEmail(
    args: FindOneByAccountIdAndEmailArgs,
  ): Promise<User | undefined>;
  findOneByAccountIdAndUserId(
    args: FindOneByAccountIdAndUserIdArgs,
  ): Promise<(User & UserRole) | undefined>;
  findOneByUserId(userId: string): Promise<User | undefined>;
  findAll(args: FindAllArgs): Promise<User[]>;
  count(accountId: string): Promise<number>;
  create(args: CreateUserArgs): Promise<User>;
  save(args: User): Promise<User>;
}
