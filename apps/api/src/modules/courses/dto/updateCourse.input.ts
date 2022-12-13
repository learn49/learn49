import { Field, InputType, ID } from '@nestjs/graphql';
import { UpdateLabelInput } from './updateLabel.input';

@InputType()
export class UpdateCourseInput {
  @Field(() => ID)
  courseId: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  image: string;

  @Field({ nullable: true })
  defaultVersion: string;

  @Field({ nullable: true })
  videoPreview: string;

  @Field({ nullable: true })
  slug: string;

  @Field({ nullable: true })
  duration: string;

  @Field(() => [UpdateLabelInput], { nullable: true })
  labels: UpdateLabelInput[];
}
