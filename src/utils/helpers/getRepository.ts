import { EntityTarget, Repository } from 'typeorm';

import { AppDataSource } from '../../configs/config.db';

export const getRepository = <T>(entity: EntityTarget<T>): Repository<T> => {
  return AppDataSource.getRepository(entity);
};
