import { GuardedUser } from 'src/utils/dtos/user';
import { FindOptionsWhere } from 'typeorm';

import { User } from '../../entities/User';
import { getRepository } from '../../utils/helpers/getRepository';
import { HttpError } from '../Error/HttpError.class';

export class UserService {
  #userRepository = getRepository(User);

  saveUser = (user: User): Promise<User> => {
    try {
      return this.#userRepository.save(user);
    } catch (e) {
      throw new HttpError(403, "Can't save user, try again");
    }
  };

  getUser = async (options: FindOptionsWhere<User>): Promise<User> => {
    const user = await this.#userRepository.findOneBy(options);

    if (!user) {
      throw new HttpError(404, 'User not found', 'Get user');
    }

    return user;
  };

  getUserWithoutPassword = async (options: FindOptionsWhere<User>): Promise<GuardedUser> => {
    const { password: _password, ...user } = await this.getUser(options);

    return user;
  };
}
