import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';
import { InputValidator } from '@/utils/validation';

@InputType()
export class UserInput {
  @Field({ nullable: true }) firstName: string;
  @Field({ nullable: true }) lastName: string;

  @Field()
  email: string;
  @Field() passwd: string;
}

export class UserInputValidator extends InputValidator {
  static fromBase(input: UserInput) {
    const user = new UserInputValidator();
    user.email = input.email;
    user.passwd = input.passwd;
    return user;
  }

  @IsEmail()
  email: string;

  @MinLength(8)
  passwd: string;
}
