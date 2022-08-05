import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SafeParseReturnType } from 'zod';

import { configDev } from '../../configs/config.dev';
import { User } from '../../entities/User';
import { signUpSchema } from '../../utils/schemas/signUp.schema';
import { SignUpBody, SignUpResponse } from '../../utils/types/user';
import { HttpError } from '../Error/HttpError.class';
import { UserService } from '../User/User.service';

export class AuthService {
  #userService: UserService;

  #saltRounds = 10;

  #tokenExpiresIn = 1000 * 60 * 15;

  constructor(userService: UserService) {
    this.#userService = userService;
  }

  validateSignUp = (body: SignUpBody): SafeParseReturnType<SignUpBody, SignUpBody> => {
    return signUpSchema.safeParse(body);
  };

  signUp = async (body: SignUpBody): Promise<SignUpResponse> => {
    const result = this.validateSignUp(body);

    if (!result.success) {
      throw new HttpError(
        403,
        result.error.issues.map((issue) => issue.message).join(', '),
        'Sign Up'
      );
    }

    const isUserExist = await this.#userService.getUser({ email: body.email });

    if (isUserExist) {
      throw new HttpError(403, 'User with this email already exist', 'Sign Up');
    }

    const user = new User();
    user.email = body.email;
    user.password = await bcrypt.hash(body.password, this.#saltRounds);

    const newUser = await this.#userService.saveUser(user);
    const accessToken = sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      configDev.secret,
      {
        expiresIn: this.#tokenExpiresIn,
      }
    );
    const refreshToken = await bcrypt.hash(new Date().toUTCString(), this.#saltRounds);

    return {
      accessToken,
      refreshToken,
    };
  };
}
