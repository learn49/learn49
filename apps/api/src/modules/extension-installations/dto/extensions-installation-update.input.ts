import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ExtensionInstallationUpdateInput {
  @Field({ nullable: true }) active: boolean;
  @Field({ nullable: true }) permission_values: string;
  @Field({ nullable: true }) settings_values: string;
}
