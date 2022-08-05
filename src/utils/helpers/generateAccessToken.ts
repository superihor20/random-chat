import { sign } from 'jsonwebtoken';

import { configDev } from '../../configs/config.dev';

export const generateAccessToken = (payload: object): string => {
  return sign(payload, configDev.secret, {
    expiresIn: configDev.tockenExpiresIn,
  });
};
