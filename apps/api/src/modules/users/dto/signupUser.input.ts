import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignUpUserInput {
  @Field() email: string;
  @Field() acceptTerms: boolean;
  @Field() passwd: string;
  @Field({ nullable: true }) firstName: string;
  @Field({ nullable: true }) lastName: string;
  @Field() recaptcha: string;
}
