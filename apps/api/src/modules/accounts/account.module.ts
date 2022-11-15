import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecaptchaService } from '@/utils/recaptcha';

import { UserRole } from '@/modules/users/user-role.entity';
import { User } from '@/modules/users/user.entity';
import { Account } from './account.entity';

import { AccountResolver } from './account.resolvers';
import { AccountService } from './account.service';
import { CustomUserRepository } from '@/modules/users/repositories/typeorm/user.repository';
import { CustomUserRoleRepository } from '@/modules/users/repositories/typeorm/user-role.repository';
import { CustomAccountRepository } from './repositories/typeorm/account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Account, UserRole, User])],
  providers: [
    AccountResolver,
    AccountService,
    RecaptchaService,
    {
      provide: 'USER_REPOSITORY',
      useClass: CustomUserRepository,
    },
    {
      provide: 'USER_ROLE_REPOSITORY',
      useClass: CustomUserRoleRepository,
    },
    {
      provide: 'ACCOUNT_REPOSITORY',
      useClass: CustomAccountRepository,
    },
  ],
})
export class AccountModule {}
