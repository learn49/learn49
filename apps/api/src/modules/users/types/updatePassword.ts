export type UpdatePassword = {
  accountId: string;
  userId: string;
  currentPasswd: string;
  newPasswd: string;
  confirm: string;
};
