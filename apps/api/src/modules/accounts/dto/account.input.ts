import { InputType, Field } from '@nestjs/graphql';
import { IsAlphanumeric, MinLength, IsEmail } from 'class-validator';
import { InputValidator } from '@/utils/validation';

@InputType()
export class AccountInput {
  @Field() subdomain: string;
  @Field() email: string;
  @Field() passwd: string;
  @Field() recaptcha: string;
}

export class AccountInputValidator extends InputValidator {
  static fromBase(input: AccountInput) {
    const account = new AccountInputValidator();
    account.subdomain = input.subdomain;
    account.email = input.email;
    account.passwd = input.passwd;
    return account;
  }

  @IsAlphanumeric()
  @MinLength(6)
  subdomain: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  passwd: string;
}
