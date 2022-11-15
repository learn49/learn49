import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class EnrollmentInput {
  @Field(() => ID)
  studentId: string;

  @Field(() => ID)
  courseId: string;

  @Field(() => ID, { nullable: true })
  courseVersionId: string;

  @Field()
  startDate: Date;

  @Field()
  type: string;

  @Field({ nullable: true })
  endDate: Date;
}
