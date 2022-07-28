import { MessageTypes } from '@enums/message-types';

import { Message } from './message';
import { User } from './user';

export type MessageData = {
  type: MessageTypes;
  data: Message | User | Date | string;
};
