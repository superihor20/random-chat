import bcrypt from 'bcrypt';
import { SafeParseReturnType } from 'zod';

import { User } from '../../entities/User';
import { generateAccessToken } from '../../utils/helpers/generateAccessToken';
import { generateRefreshToken } from '../../utils/helpers/generateRefreshToken';
import { authSchema } from '../../utils/schemas/auth.schema';
import { AuthBody, AuthResponse } from '../../utils/types/auth';
import { HttpError } from '../Error/HttpError.class';
import { UserService } from '../User/User.service';

export class AuthService {
  #userService: UserService;

  #saltRounds = 10;

  constructor(userService: UserService) {
    this.#userService = userService;
  }

  validateAuthBody = (body: AuthBody): SafeParseReturnType<AuthBody, AuthBody> => {
    return authSchema.safeParse(body);
  };

  signUp = async (body: AuthBody): Promise<AuthResponse> => {
    const result = this.validateAuthBody(body);

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
    const accessToken = generateAccessToken({ id: newUser.id, email: newUser.email });
    const refreshToken = await generateRefreshToken(this.#saltRounds);

    return {
      accessToken,
      refreshToken,
    };
  };

  signIn = async (body: AuthBody): Promise<AuthResponse> => {
    const result = this.validateAuthBody(body);

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

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = await generateRefreshToken(this.#saltRounds);

    return {
      accessToken,
      refreshToken,
    };
  };
}
