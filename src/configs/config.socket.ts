import { ServerOptions } from 'socket.io';

import { configDev } from './config.dev';

export const configSocket: Partial<ServerOptions> = {
  path: '/',
  cors: {
    origin: configDev.clienUrl,
  },
};
