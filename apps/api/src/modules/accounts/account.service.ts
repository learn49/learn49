import { Inject, Injectable } from '@nestjs/common';

import { generateHash } from '../../auth/auth';
import { Account } from './account.entity';
import { AppExceptions } from '@/utils/AppExceptions';
import { IUserRepository } from '@/modules/users/repositories/user-repository.interface';
import { IUserRoleRepository } from '@/modules/users/repositories/user-role-repository.interface';
import { IAccountRepository } from './repositories/account-repository.interface';
import {
  CreateAccountArgs,
  GetByDomainArgs,
  GetBySubdomainArgs,
  UpdateAccountArgs,
} from './types';

@Injectable()
export class AccountService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository,
    @Inject('USER_ROLE_REPOSITORY')
    private readonly userRoleRepository: IUserRoleRepository,
    @Inject('ACCOUNT_REPOSITORY')
    private readonly accountRepository: IAccountRepository,
  ) { }

  async create({
    subdomain,
    email,
    passwd,
  }: CreateAccountArgs): Promise<Account> {
    const accountAlreadyExists = await this.accountRepository.findOneBySubdomain(
      subdomain,
    );

    if (accountAlreadyExists) {
      throw AppExceptions.SubdomainAlreadyExists;
    }

    const account = await this.accountRepository.create(subdomain);

    const user = await this.userRepository.create({
      accountId: account.id,
      emails: [{ email, verified: false, main: true }],
      passwd: generateHash(passwd),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userRoleRepository.create({
      accountId: account.id,
      userId: user.id,
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return account;
  }

  async getBySubdomain({ subdomain }: GetBySubdomainArgs): Promise<Account> {
    const account = await this.accountRepository.findOneBySubdomain(subdomain);

    if (!account) {
      throw AppExceptions.AccountNotFound;
    }

    return account;
  }

  async getByDomain({ domain }: GetByDomainArgs): Promise<Account> {
    const listOfValidDomains = [
      'staging.learn49.com',
      'learn49.com',
      'learn49.net',
      'learn49.me',
    ];
    const testAccounts = {
      localhost: 'learn49',
      '127.0.0.1': 'learn50',
    };

    const validDomain = listOfValidDomains.find(currDomain =>
      domain.endsWith(currDomain),
    );

    let account = null;

    if (validDomain || testAccounts[domain.split(':')[0]]) {
      let subdomain = testAccounts[domain.split(':')[0]];

      if (validDomain) {
        subdomain = domain.split('.' + validDomain)[0];
      }

      account = await this.accountRepository.findOneBySubdomain(subdomain);
    } else {
      // const jsonWhere = JSON.stringify([{ domain }]);
      // // search by domain
      // account = await this.knex('accounts')
      //   .select('*')
      //   .whereRaw('domains @> ?', [jsonWhere])
      //   .first();
    }

    if (!account) {
      throw AppExceptions.AccountNotFound;
    }

    return account;
  }

  async updateAccount({
    accountId,
    userId,
    friendlyName,
    description,
    recaptchaSiteKey,
    recaptchaSecret,
  }: UpdateAccountArgs): Promise<Account> {
    const userRole = await this.userRoleRepository.findOneByAccountIdAndUserId({
      userId,
      accountId,
    });

    if (!userRole) {
      throw AppExceptions.UserRoleNotFound;
    }

    if (userRole.role !== 'owner') {
      throw AppExceptions.AccessDenied;
    }

    const account = await this.accountRepository.findOneById(accountId);

    if (!account) {
      throw AppExceptions.AccountNotFound;
    }

    if (friendlyName) account.friendlyName = friendlyName;
    if (description) account.description = description;
    if (recaptchaSiteKey) account.recaptchaSiteKey = recaptchaSiteKey;
    if (recaptchaSecret) account.recaptchaSecret = recaptchaSecret;

    await this.accountRepository.save(account);

    return account;
  }
}
