import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { configDev } from '../../configs/config.dev';
import { HttpError } from '../Error/HttpError.class';

export class TokenService {
  #secret = configDev.secret;

  #accessTokenExpiresIn = configDev.accessTokenExpiresIn;

  #refreshTokenExpiresIn = configDev.refreshTokenExpiresIn;

  #generateToken = (payload: object, expiresIn: number): string => {
    return sign(payload, this.#secret, {
      expiresIn,
    });
  };

  generateAccessToken = (payload: object): string => {
    return this.#generateToken(payload, this.#accessTokenExpiresIn);
  };

  generateRefreshToken = (payload: object): string => {
    return this.#generateToken(payload, this.#refreshTokenExpiresIn);
  };

  generateTokenPair = (
    payloadAccess: object,
    payloadRefresh: object
  ): { accessToken: string; refreshToken: string } => {
    return {
      accessToken: this.generateAccessToken(payloadAccess),
      refreshToken: this.generateRefreshToken(payloadRefresh),
    };
  };

  verifyToken = (token: string): JwtPayload => {
    try {
      return verify(token, this.#secret) as JwtPayload;
    } catch (err) {
      throw new HttpError(403, (err as Error)?.message, 'Auth');
    }
  };
}
