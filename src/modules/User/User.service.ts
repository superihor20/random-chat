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

  getUser = (options: FindOptionsWhere<User>): Promise<User | null> => {
    return this.#userRepository.findOneBy(options);
  };
}
