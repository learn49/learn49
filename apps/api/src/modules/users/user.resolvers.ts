import {
  Resolver,
  Args,
  Query,
  Mutation,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './dto/user';
import { Auth } from './dto/auth';
import { UserInput, UserInputValidator } from './dto/user.input';
import { SignUpUserInput } from './dto/signupUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { UpdateUserPasswdInput } from './dto/updateUserPasswd.input';
import { UserConfirmationInput } from './dto/userConfirmation.input';
import { ForgotPasswordInput } from './dto/forgotPassword.input';
import { ResetPasswordInput } from './dto/resetPassword.input';
import { GetUserInput } from './dto/getUser.input';
import { UserService } from './user.service';
import { Upload } from '@/scalars/upload.scalar';
import { AuthGuard } from '@/auth/authGuard';
import { RecaptchaService } from '@/utils/recaptcha';
import { SentryInterceptor } from '@/sentry.interceptor';
import { Entity } from '../extensions/dto/WriteCustomFieldInput';
import { CustomFieldExtension } from '../extensions/providers/custom-field.extension';

@UseInterceptors(SentryInterceptor)
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly recaptchaService: RecaptchaService,
    private readonly customFieldExtension: CustomFieldExtension,
  ) { }

  @UseGuards(AuthGuard)
  @Query(() => [User], { name: 'getUsers' })
  async getUsers(
    @Args('accountId') accountId: string,
    @Args('offset') offset: number,
    @Args({ type: () => String, name: 'name', nullable: true }) name: string,
    @Args('limit') limit: number,
  ) {
    const { users } = await this.userService.findAll({
      accountId,
      name,
      offset,
      limit,
    });

    return users;
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'getUser' })
  async getUser(
    @Args('input') input: GetUserInput,
    @Args('accountId') accountId: string,
  ) {
    return this.userService.findOne({ accountId, ...input });
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'getMe' })
  async getMe(
    @Args('accountId') accountId: string,
    @Context('user') user: User,
  ) {
    return this.userService.getMe({ accountId, userId: user.id });
  }

  @Mutation(() => Auth, { name: 'auth' })
  async auth(
    @Args('input') input: UserInput,
    @Args('accountId') accountId: string,
  ) {
    return this.userService.auth({ accountId, ...input });
  }

  @Mutation(() => User, { name: 'signUpUser' })
  async signUpUser(
    @Args('input') input: SignUpUserInput,
    @Args('accountId') accountId: string,
  ) {
    await this.recaptchaService.validate(input.recaptcha, accountId);
    return this.userService.create({ accountId, ...input });
  }

  @Mutation(() => User, { name: 'createUser' })
  async createUser(
    @Args('input') input: UserInput,
    @Args('accountId') accountId: string,
  ) {
    await UserInputValidator.fromBase(input).validate();
    return this.userService.create({ accountId, ...input });
  }

  @Mutation(() => User, { name: 'userConfirmation' })
  async userConfirmation(
    @Args('accountId') accountId: string,
    @Args('input') input: UserConfirmationInput,
  ) {
    return this.userService.userConfirmation({ accountId, ...input });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @Args('accountId') accountId: string,
    @Context('user') user: User,
  ) {
    const { id } = user;
    return this.userService.update({
      accountId,
      userId: id,
      ...input,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User, { name: 'updatePassword' })
  async updatePassword(
    @Args('input') input: UpdateUserPasswdInput,
    @Args('accountId') accountId: string,
    @Context('user') user: User,
  ) {
    const { id } = user;
    return this.userService.updatePassword({
      userId: id,
      accountId,
      ...input,
    });
  }

  @Mutation(() => String, { name: 'forgotPassword' })
  async forgotPassword(
    @Args('input') input: ForgotPasswordInput,
    @Args('accountId') accountId: string,
  ) {
    return this.userService.forgotPassword({
      accountId,
      ...input,
    });
  }

  @Mutation(() => User, { name: 'resetPassword' })
  async resetPassword(
    @Args('accountId') accountId: string,
    @Args('input') input: ResetPasswordInput,
  ) {
    return this.userService.resetPassword({ accountId, ...input });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User, { name: 'disableUser' })
  async disableUser(
    @Args('accountId') accountId: string,
    @Args('deleteUserId') deleteUserId: string,
    @Context('user') user: User,
  ) {
    return this.userService.disable({
      accountId,
      userId: user.id,
      deleteUserId,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User, { name: 'uploadProfilePicture' })
  async uploadProfilePicture(
    @Args('accountId') accountId: string,
    @Args('file') file: Upload,
    @Context('user') user: User,
  ) {
    const { id: userId } = user;
    const profile = await this.userService.updateProfilePicture({
      accountId,
      userId,
      file,
    });

    return {
      ...profile,
      // TODO: bypass temporary until this feature is refactored
      email: profile.emails[0].email,
    };
  }

  @ResolveField(() => String, { nullable: true })
  async extensions(
    @Parent() user: User,
    @Args('installationId') installationId: string,
    @Args('slug') extensionSlug: string,
    @Args('field') field: string,
  ) {
    return this.customFieldExtension.read({
      accountId: user.accountId,
      entity: Entity.users,
      entityId: user.id,
      installationId,
      extensionSlug,
      field,
    });
  }
}
