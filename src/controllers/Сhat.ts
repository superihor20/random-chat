import { RandomlyGeneratedMessageTypes } from '../utils/enums/message-types';
import getRandomEnumValue from '../utils/helpers/getRandomEnumValue';
import getRandomNumber from '../utils/helpers/getRandomNumber';
import { Messages } from '../utils/type/message';
import { MessageData } from '../utils/type/message-data';
import { Users } from '../utils/type/user';

class Chat {
  #users: Users;

  #messages: Messages;

  #numberOfUsers = 0;

  #numberOfMessages = 0;

  constructor(messages: Messages, users: Users) {
    this.#messages = messages;
    this.#users = users;
    this.#numberOfMessages = messages.length;
    this.#numberOfUsers = users.length;
  }

  getRandomMessage = (): MessageData => {
    const randomMessageType = getRandomEnumValue(RandomlyGeneratedMessageTypes);

    return this.#generateRandomMessage(randomMessageType);
  };

  #generateRandomMessage = (messageType: RandomlyGeneratedMessageTypes): MessageData => {
    const message: MessageData = {
      type: messageType,
      data: '',
    };

    switch (messageType) {
      case RandomlyGeneratedMessageTypes.CHAT_MESSAGE: {
        const data = this.#messages[getRandomNumber(this.#numberOfMessages - 1)];
        message.data = `${data.username}: ${data.message}`;

        break;
      }
      case RandomlyGeneratedMessageTypes.MESSAGE: {
        message.data = `User ${
          this.#users[getRandomNumber(this.#numberOfUsers - 1)].username
        } joined!!!`;

        break;
      }
      case RandomlyGeneratedMessageTypes.TIME: {
        message.data = new Date();

        break;
      }
      default:
        break;
    }

    return message;
  };

  get users(): Users {
    return this.#users;
  }

  get numberOfUsers(): number {
    return this.#numberOfUsers;
  }

  get messages(): Messages {
    return this.#messages;
  }

  get numberOfMessages(): number {
    return this.#numberOfMessages;
  }
}

export default Chat;
