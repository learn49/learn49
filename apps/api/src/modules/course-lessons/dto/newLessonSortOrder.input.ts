import { ID, InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class NewLessonSortOrderInput {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  baseLessonId: string;

  @Field()
  title: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  blocks: string;

  @Field({ nullable: true })
  releaseOnDate: Date;

  @Field(() => Int, { nullable: true })
  releaseAfter: number;
}
