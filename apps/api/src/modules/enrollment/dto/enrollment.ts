import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Enrollment {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  accountId: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  courseId: string;

  @Field(() => ID, { nullable: true })
  courseVersionId: string;

  @Field()
  student: string;

  @Field()
  course: string;

  @Field()
  type: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  courseVersionName: string;

  @Field()
  enrollmentDate: Date;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;
}
