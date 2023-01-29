import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Label } from '@/modules/labels/dto/label';
import { JSONObject } from '@/utils/type-utils';

@ObjectType()
export class Course {
  @Field(() => ID)
  id: string;

  @Field()
  accountId: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  image: string;

  @Field({ nullable: true })
  defaultVersion: string;

  @Field({ nullable: true })
  slug: string;

  @Field({ nullable: true })
  duration: string;

  @Field(() => ID, { nullable: true })
  courseVersionId: string;

  @Field({ nullable: true })
  videoPreview: string;

  progress: number;

  @Field(() => [String], { nullable: true })
  versions?: string[];

  @Field({ nullable: true })
  latestVersion?: string;

  @Field({ nullable: true })
  latestVersionAccessed?: string;

  @Field(() => [Label], { nullable: true })
  labels: Label[];

  @Field({ nullable: true })
  takeaway: string;

  @Field(() => [Course], { nullable: true })
  relatedCourses: Course[];

  @Field(() => [Course], { nullable: true })
  nextUpCourses: Course[];

  @Field(() => [Course], { nullable: true })
  requiredCourses: Course[];
}
