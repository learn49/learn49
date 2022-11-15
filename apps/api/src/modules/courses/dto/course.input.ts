import { InputType, Field } from '@nestjs/graphql';
import { LabelInput } from '@/modules/labels/dto/label.input';

@InputType()
export class CourseInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  versionName: string;

  @Field(() => [LabelInput], { nullable: true })
  labels: LabelInput[];
}
