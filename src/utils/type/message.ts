import { User } from './user';

export type Message = {
  id: number;
  user: User;
  message: string;
};

export type Messages = Message[];
