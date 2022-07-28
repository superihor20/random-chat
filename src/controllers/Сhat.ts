import { MessageTypes } from '../utils/enums/message-types';
import { getRandomEnum } from '../utils/helpers/getRandomEnum';
import { getRandomNumber } from '../utils/helpers/getRandomNumber';
import { Message, Messages } from '../utils/types/message';
import { User, Users } from '../utils/types/user';

export class Chat {
  users: Users;
  messages: Messages;
  numberOfUsers = 0;
  numberOfMessages = 0;

  constructor(messages: Messages, users: Users) {
    this.messages = messages;
    this.users = users;
    this.numberOfMessages = messages.length;
    this.numberOfUsers = messages.length;
  }

  getRandomMessage = () => {
    const randomMessageType = getRandomEnum(MessageTypes);

    return this.generateRandomMessage(randomMessageType);
  };

  generateRandomMessage = (messageType: MessageTypes) => {
    const message: {
      type: MessageTypes;
      data: Message | User | Date | string;
    } = {
      type: messageType,
      data: '',
    };

    switch (messageType) {
      case MessageTypes.CHAT_MESSAGE:
        message.data =
          this.messages[getRandomNumber(this.numberOfMessages - 1)];
        break;
      case MessageTypes.MESSAGE:
        message.data = `User ${
          this.users[getRandomNumber(this.numberOfUsers - 1)]
        } joined!!!`;
        break;
      case MessageTypes.TIME:
        message.data = new Date();
        break;
    }

    return message;
  };
}
