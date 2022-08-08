import { FindOptionsWhere } from 'typeorm';
import { SafeParseReturnType } from 'zod';

import { User } from '../../entities/User';
import { SuccessfulResponse } from '../../utils/dtos/successfulResponse';
import { GuardedUser, UserUpdateBody } from '../../utils/dtos/user';
import { getRepository } from '../../utils/helpers/getRepository';
import { userSchema } from '../../utils/schemas/user.schema';
import { HttpError } from '../Error/HttpError.class';

export class UserService {
  #userRepository = getRepository(User);

  validateUserBody = (
    body: UserUpdateBody
  ): SafeParseReturnType<UserUpdateBody, UserUpdateBody> => {
    return userSchema.safeParse(body);
  };

  saveUser = (user: User): Promise<User> => {
    try {
      return this.#userRepository.save(user);
    } catch (e) {
      throw new HttpError(403, "Can't save user, try again");
    }
  };

  getUserByOptionsSafe = async (options: FindOptionsWhere<User>): Promise<User> => {
    const user = await this.getUserByOptions(options);

    if (!user) {
      throw new HttpError(404, 'User not found', 'Get user');
    }

    return user;
  };

  getUserByOptions = async (options: FindOptionsWhere<User>): Promise<User | null> => {
    return this.#userRepository.findOneBy(options);
  };

  getUserWithoutPassword = async (options: FindOptionsWhere<User>): Promise<GuardedUser> => {
    const { password: _password, ...user } = await this.getUserByOptionsSafe(options);

    return user;
  };

  prepareUser = async (id: number, body: UserUpdateBody): Promise<User> => {
    const user = new User();
    user.id = id;

    if (body.email) {
      const isEmailAlreadyUsed = await this.getUserByOptions({ email: body.email });

      if (isEmailAlreadyUsed) {
        throw new HttpError(422, 'This email already used by another user', 'Update User');
      }

      user.email = body.email;
    }

    if (body.username) {
      const isUsernameAlreadyUsed = await this.getUserByOptions({ username: body.username });

      if (isUsernameAlreadyUsed) {
        throw new HttpError(422, 'This username already used by another user', 'Update User');
      }

      user.username = body.username;
    }

    if (body.password) {
      user.password = body.password;
    }

    return user;
  };

  updateUser = async (id: number, body: UserUpdateBody): Promise<SuccessfulResponse> => {
    const validationResult = this.validateUserBody(body);

    if (!validationResult.success) {
      throw new HttpError(
        403,
        validationResult.error.issues.map((issue) => issue.message).join(', '),
        'Update User'
      );
    }

    const user = await this.prepareUser(id, body);

    await this.saveUser(user);

    return { success: true };
  };
}
