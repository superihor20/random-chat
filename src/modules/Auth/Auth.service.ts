import bcrypt from 'bcrypt';
import { SafeParseReturnType } from 'zod';

import { User } from '../../entities/User';
import { signUpSchema } from '../../utils/schemas/signUp.schema';
import { SignUpBody } from '../../utils/types/user';
import { HttpError } from '../Error/HttpError.class';
import { UserService } from '../User/User.service';

export class AuthService {
  private userService: UserService;

  private saltRounds = 10;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  validateSignUp = (body: SignUpBody): SafeParseReturnType<SignUpBody, SignUpBody> => {
    return signUpSchema.safeParse(body);
  };

  signUp = async (body: SignUpBody): Promise<void> => {
    const result = this.validateSignUp(body);

    if (!result.success) {
      throw new HttpError(
        403,
        result.error.issues.map((issue) => issue.message).join(', '),
        'Sign Up'
      );
    }

    const isUserExist = await this.userService.getUser({ email: body.email });

    if (!isUserExist) {
      throw new HttpError(403, 'User with this email already exist', 'Sign Up');
    }

    const user = new User();
    user.email = body.email;
    user.password = await bcrypt.hash(body.password, this.saltRounds);

    await this.userService.saveUser(user);
  };
}
