import { Logger } from 'tslog';

export class LoggerService {
  #logger: Logger;

  constructor() {
    this.#logger = new Logger({
      displayInstanceName: false,
      displayLoggerName: false,
      displayFilePath: 'hidden',
      displayFunctionName: false,
    });

    this.log('LoggerService Service was initialize');
  }

  log(...args: unknown[]): void {
    this.#logger.info(...args);
  }

  warn(...args: unknown[]): void {
    this.#logger.warn(...args);
  }

  error(...args: unknown[]): void {
    this.#logger.error(...args);
  }
}
