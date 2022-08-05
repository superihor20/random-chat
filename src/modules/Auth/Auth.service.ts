import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SafeParseReturnType } from 'zod';

import { configDev } from '../../configs/config.dev';
import { User } from '../../entities/User';
import { authSchema } from '../../utils/schemas/signUp.schema';
import { AuthBody, AuthResponse } from '../../utils/types/user';
import { HttpError } from '../Error/HttpError.class';
import { UserService } from '../User/User.service';

export class AuthService {
  #userService: UserService;

  #saltRounds = 10;

  #tokenExpiresIn = 1000 * 60 * 15;

  constructor(userService: UserService) {
    this.#userService = userService;
  }

  validateSignUp = (body: AuthBody): SafeParseReturnType<AuthBody, AuthBody> => {
    return authSchema.safeParse(body);
  };

  signUp = async (body: AuthBody): Promise<AuthResponse> => {
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

  signIn = async (body: AuthBody): Promise<AuthResponse> => {
    const result = this.validateSignUp(body);

    if (!result.success) {
      throw new HttpError(
        403,
        result.error.issues.map((issue) => issue.message).join(', '),
        'Sign In'
      );
    }

    const user = await this.#userService.getUser({ email: body.email });

    if (!user) {
      throw new HttpError(404, 'User not found', 'Sign In');
    }

    const isPasswordCorrect = await bcrypt.compare(body.password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpError(403, 'Incorect credentials, please try again', 'Sign In');
    }

    const accessToken = sign(
      {
        id: user.id,
        email: user.email,
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
