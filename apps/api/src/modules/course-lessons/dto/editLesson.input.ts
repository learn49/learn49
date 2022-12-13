import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class EditLessonInput {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  blocks: string;

  @Field({ nullable: true })
  releaseOnDate: Date;

  @Field({ nullable: true })
  status: string;

  @Field(() => Int, { nullable: true })
  releaseAfter: number;

  @Field({ nullable: true })
  slug: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  duration: string;
}
