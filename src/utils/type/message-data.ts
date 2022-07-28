import { RandomlyGeneratedMessageTypes, UserActionMessageTypes } from '../enums/message-types';

import { Message } from './message';
import { User } from './user';

export type MessageData = {
  type: RandomlyGeneratedMessageTypes | UserActionMessageTypes;
  data: Message | User | Date | string;
};
