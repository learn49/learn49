import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateThreadInput {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  body: string;

  @Field({ nullable: true })
  tags: string;

  @Field({ nullable: true })
  isTicket: boolean;

  @Field({ nullable: true })
  isClosed: boolean;

  @Field({ nullable: true })
  isSolved: boolean;

  @Field({ nullable: true })
  isPinned: boolean;
}
