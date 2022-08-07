import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { configDev } from '../../configs/config.dev';

export const generateRefreshToken = async (salt: number | string): Promise<string> => {
  const payload = await bcrypt.hash(new Date().toUTCString(), salt);

  return sign(payload, configDev.secret, {
    expiresIn: configDev.refreshTokenExpiresIn,
  });
};
