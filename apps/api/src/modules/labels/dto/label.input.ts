import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LabelInput {
  @Field()
  label: string;

  @Field()
  isPrivate: boolean;
}
