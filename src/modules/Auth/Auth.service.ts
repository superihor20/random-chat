import { SafeParseReturnType } from 'zod';

import { signUpSchema } from '../../utils/schemas/signUp.schema';
import { SignUpBody } from '../../utils/types/user';

export class AuthService {
  validateSignUp = (body: SignUpBody): SafeParseReturnType<SignUpBody, SignUpBody> => {
    return signUpSchema.safeParse(body);
  };
}
