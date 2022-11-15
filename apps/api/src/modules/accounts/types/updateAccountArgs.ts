export type UpdateAccountArgs = {
  accountId: string;
  userId: string;
  friendlyName?: string;
  description?: string;
  recaptchaSiteKey?: string;
  recaptchaSecret?: string;
};
