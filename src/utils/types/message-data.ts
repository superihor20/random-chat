import { ServerActionMessageTypes, UserActionMessageTypes } from '../enums/message-types';

import { Message } from './message';
import { User } from './user';

export type MessageData = {
  type: ServerActionMessageTypes | UserActionMessageTypes;
  data: Message | User | Date | string;
};
