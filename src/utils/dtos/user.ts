import { User } from '../../entities/User';

export type GuardedUser = Omit<User, 'password'>;

export type UserUpdateBody = Partial<Omit<User, 'id' | 'avatar' | 'banner'>>;
