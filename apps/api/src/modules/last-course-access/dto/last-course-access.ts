import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class LastCourseAccess {
  @Field(() => ID) id: string;
  @Field(() => ID) courseId: string;
  @Field(() => ID) courseVersionId: string;
  @Field(() => ID) lessonId: string;
  @Field() courseTitle: string;
  @Field() moduleTitle: string;
  @Field() lessonTitle: string;
  @Field() lastAccess: Date;
}
