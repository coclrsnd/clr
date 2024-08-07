// reset-password.model.ts

export interface ResetPassword {
  email: string;
  currentPassword: string;
  newPassword: string;
}
