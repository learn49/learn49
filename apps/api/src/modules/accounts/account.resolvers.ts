import { Resolver, Args, Mutation, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/authGuard';
import { Account } from './dto/account';
import { AccountInput, AccountInputValidator } from './dto/account.input';
import {
  UpdateAccountInput,
  UpdateAccountInputValidator,
} from './dto/updateAccount.input';
import { AccountService } from './account.service';
import { User } from '../users/dto/user';
import { RecaptchaService } from '../../utils/recaptcha';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Resolver(() => Account)
export class AccountResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly recaptchaService: RecaptchaService,
  ) {}

  @Mutation(() => Account)
  async createAccount(@Args('input') input: AccountInput) {
    await AccountInputValidator.fromBase(input).validate();
    await this.recaptchaService.validate(input.recaptcha);
    return this.accountService.create(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Account)
  async updateAccount(
    @Args('input') input: UpdateAccountInput,
    @Args('accountId') accountId: string,
    @Context('user') user: User,
  ) {
    await UpdateAccountInputValidator.fromBase(input).validate();
    const { id: userId } = user;
    return this.accountService.updateAccount({
      accountId,
      userId,
      ...input,
    });
  }

  @Query(() => Account)
  async getAccountSettingsByDomain(@Args('domain') domain: string) {
    return this.accountService.getByDomain({ domain });
  }
}
