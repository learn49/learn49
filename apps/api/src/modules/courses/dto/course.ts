import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Label } from '@/modules/labels/dto/label';

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
}
