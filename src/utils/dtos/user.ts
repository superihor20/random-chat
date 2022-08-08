import { User } from '../../entities/User';

export type GuardedUser = Omit<User, 'password'>;
