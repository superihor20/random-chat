import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { SafeParseReturnType } from 'zod';

import { User } from '../../entities/User';
import { AuthBody, AuthResponse, RefreshBody } from '../../utils/dtos/auth';
import { authSchema } from '../../utils/schemas/auth.schema';
import { HttpError } from '../Error/HttpError.class';
import { TokenService } from '../Token/Token.service';
import { UserService } from '../User/User.service';

export class AuthService {
  #userService: UserService;

  #tokenService: TokenService;

  #saltRounds = 10;

  constructor(tokenService: TokenService, userService: UserService) {
    this.#userService = userService;
    this.#tokenService = tokenService;
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

    return this.#tokenService.generateTokenPair(
      { id: newUser.id, email: newUser.email },
      { id: newUser.id, email: newUser.email, createAt: new Date().toUTCString() }
    );
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

    return this.#tokenService.generateTokenPair(
      { id: user.id, email: user.email },
      { id: user.id, email: user.email, createAt: new Date().toUTCString() }
    );
  };

  guard = (authHeader: string | undefined): JwtPayload => {
    const token = authHeader?.split?.(' ')?.[1];

    if (!authHeader || !token) {
      throw new HttpError(401, "You don't have access here", 'Auth');
    }

    return this.#tokenService.verifyToken(token);
  };

  refresh = async (body: RefreshBody): Promise<AuthResponse> => {
    const info = this.#tokenService.verifyToken(body.refreshToken);
    const user = await this.#userService.getUser({ email: info.email });

    if (!user) {
      throw new HttpError(403, 'Something wrong with token', 'Refresh');
    }

    return this.#tokenService.generateTokenPair(
      { id: user.id, email: user.email },
      { id: user.id, email: user.email, createAt: new Date().toUTCString() }
    );
  };
}
