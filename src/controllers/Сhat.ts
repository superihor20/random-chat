import MessageTypes from '../utils/enums/message-types';
import getRandomEnum from '../utils/helpers/getRandomEnum';
import getRandomNumber from '../utils/helpers/getRandomNumber';
import { Messages } from '../utils/types/message';
import MessageData from '../utils/types/message-data';
import { Users } from '../utils/types/user';

class Chat {
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

  getRandomMessage = (): MessageData => {
    const randomMessageType = getRandomEnum(MessageTypes);

    return this.generateRandomMessage(randomMessageType);
  };

  generateRandomMessage = (messageType: MessageTypes): MessageData => {
    const message: MessageData = {
      type: messageType,
      data: '',
    };

    switch (messageType) {
      case MessageTypes.CHAT_MESSAGE:
        message.data = this.messages[getRandomNumber(this.numberOfMessages - 1)];
        break;
      case MessageTypes.MESSAGE:
        message.data = `User ${this.users[getRandomNumber(this.numberOfUsers - 1)]} joined!!!`;
        break;
      case MessageTypes.TIME:
        message.data = new Date();
        break;
      default:
        break;
    }

    return message;
  };
}

export default Chat;
