import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class ExtensionInstallationInput {
  @Field() active: boolean;
  @Field(() => ID) extension_id: string;
  @Field({ nullable: true }) permission_values: string;
  @Field({ nullable: true }) settings_values: string;
}
