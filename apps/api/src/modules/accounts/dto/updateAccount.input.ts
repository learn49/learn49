import { InputType, Field } from '@nestjs/graphql';
import { MinLength, IsOptional, IsFQDN } from 'class-validator';
import { InputValidator } from '@/utils/validation';

@InputType()
export class UpdateAccountInput {
  @Field({ nullable: true }) domain: string;
  @Field({ nullable: true }) description: string;
  @Field({ nullable: true }) friendlyName: string;
  @Field({ nullable: true }) recaptchaSiteKey: string;
  @Field({ nullable: true }) recaptchaSecret: string;
}

// TODO: add subdomain

export class UpdateAccountInputValidator extends InputValidator {
  static fromBase(input: UpdateAccountInput) {
    const account = new UpdateAccountInputValidator();
    account.domain = input.domain;
    account.description = input.description;
    account.friendlyName = input.friendlyName;
    account.recaptchaSiteKey = input.recaptchaSiteKey;
    account.recaptchaSecret = input.recaptchaSecret;
    return account;
  }

  @IsFQDN()
  @IsOptional()
  @MinLength(6)
  domain: string;

  @IsOptional()
  @MinLength(8)
  description: string;

  @IsOptional()
  @MinLength(8)
  friendlyName: string;

  @IsOptional()
  @MinLength(8)
  recaptchaSiteKey: string;

  @IsOptional()
  @MinLength(8)
  recaptchaSecret: string;
}
