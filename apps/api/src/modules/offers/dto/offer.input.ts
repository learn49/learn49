import { InputType, Field, ID } from '@nestjs/graphql';
import { OfferCoursesInput } from './offer-courses.input';

@InputType()
export class OfferInput {
  @Field() name: string;
  @Field(() => ID) extensionId: string;
  @Field() type: string;
  @Field() price: string;
  @Field() sellPage: string;
  @Field() metadata: string;
  @Field(() => [OfferCoursesInput]) courses: OfferCoursesInput[];
}
