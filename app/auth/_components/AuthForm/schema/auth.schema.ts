import * as z from 'zod';

function getPasswordMatchStatus(data: { password: string; confirmPassword?: string }) {
  return !data.confirmPassword || data.password === data.confirmPassword;
}

export const authSchema = z
  .object({
    email: z.email(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().optional(),
  })
  .refine(getPasswordMatchStatus, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

export type AuthFormValues = z.infer<typeof authSchema>;
