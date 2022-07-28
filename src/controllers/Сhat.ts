import { ServerActionMessageTypes } from '../utils/enums/message-types';
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
    this.#users = users;
    this.#messages = messages;
    this.#numberOfUsers = users.length;
    this.#numberOfMessages = messages.length;
  }

  getRandomMessage = (): MessageData => {
    const randomMessageType = getRandomEnumValue(ServerActionMessageTypes);

    return this.#generateRandomMessage(randomMessageType);
  };

  #generateRandomMessage = (messageType: ServerActionMessageTypes): MessageData => {
    const messageData: MessageData = {
      type: messageType,
      data: '',
    };

    switch (messageType) {
      case ServerActionMessageTypes.CHAT_MESSAGE: {
        const { username, message } = this.#messages[getRandomNumber(this.#numberOfMessages - 1)];
        messageData.data = `${username}: ${message}`;

        break;
      }
      case ServerActionMessageTypes.MESSAGE: {
        const { username } = this.#users[getRandomNumber(this.#numberOfUsers - 1)];
        messageData.data = `User ${username} joined!!!`;

        break;
      }
      case ServerActionMessageTypes.TIME: {
        messageData.data = new Date();

        break;
      }
      default:
        break;
    }

    return messageData;
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
