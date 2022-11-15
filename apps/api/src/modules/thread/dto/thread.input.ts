import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class ThreadInput {
  @Field(() => ID, { nullable: true })
  courseId: string;

  @Field(() => ID, { nullable: true })
  lessonId: string;

  @Field(() => ID, { nullable: true })
  moduleId: string;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field({ nullable: true })
  tags: string;

  @Field({ nullable: true })
  isTicket: boolean;
}
