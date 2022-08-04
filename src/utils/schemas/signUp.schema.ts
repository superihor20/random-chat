import { z } from 'zod';

export const signUpSchema = z.object({
  login: z.string().email({ message: 'Login should be email' }),
  password: z.string().min(8, { message: 'Must be 8 characters long' }),
});
