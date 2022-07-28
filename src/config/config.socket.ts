import { ServerOptions } from 'socket.io';

import { configurationDev } from './config.dev';

export const configSocket: Partial<ServerOptions> = {
  path: '/',
  cors: {
    origin: configurationDev.clienUrl,
  },
};
