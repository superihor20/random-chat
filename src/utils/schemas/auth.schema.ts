import { z } from 'zod';

export const authSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({ message: 'Login should be email' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Must be 8 characters long' }),
});
