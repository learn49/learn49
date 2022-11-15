import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ExtensionInstallation {
  @Field(() => ID) id: string;
  @Field({ nullable: true }) name: string;
  @Field(() => ID) accountId: string;
  @Field() active: boolean;
  @Field(() => ID) extensionId: string;
  @Field({ nullable: true }) permissionValues: string;
  @Field({ nullable: true }) settingsValues: string;
  @Field() createdAt: Date;
  @Field() updatedAt: Date;
}
