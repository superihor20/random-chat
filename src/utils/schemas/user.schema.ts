import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email({ message: 'Login should be email' }).optional(),
  password: z.string().min(8, { message: 'Must be 8 characters long' }).optional(),
  username: z.string().min(1, { message: 'Must be minimum 1 character' }).optional(),
});
