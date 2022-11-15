import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class EditCourseModuleInput {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  isActive: boolean;
}
