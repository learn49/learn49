import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class OfferCoursesInput {
  @Field(() => ID) id: string;
  @Field() settingsType: string;
  @Field({ nullable: true }) settingsVersionId: string;
  @Field() settingsPeriod: string;
}
