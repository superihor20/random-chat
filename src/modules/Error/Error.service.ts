import { Request, Response } from 'express';

import { LoggerService } from '../Logger/Logger.service';

import { ErrorInterface } from './Error.interface';
import { HttpError } from './HttpError.class';

export class ErrorService implements ErrorInterface {
  private logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;

    this.logger.log(`ErrorService Service was initialize`);
  }

  catch = (err: Error | HttpError, _req: Request, res: Response): void => {
    if (err instanceof HttpError) {
      this.logger.error(
        `${err.context ? `[${err.context}] ` : ''}Error ${err.statusCode}: ${err.message}`
      );
      res.status(err.statusCode).send({ err: err.message });
    } else {
      this.logger.error(`${err.message}`);
      res.status(500).send({ err: err.message });
    }
  };
}
