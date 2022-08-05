import { join } from 'path';

import { DataSource } from 'typeorm';

import { configDev } from './config.dev';

const absPathToSrc = join(__dirname, '../');
const absPathToEntities = join(absPathToSrc, '/entities/*.ts');
const absPathToMigrations = join(absPathToSrc, '/migrations/*.ts');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configDev.dbHost,
  port: configDev.dbPort,
  username: configDev.dbUsername,
  password: configDev.dbPassword,
  database: configDev.dbName,
  logging: true,
  synchronize: false,
  entities: [absPathToEntities],
  migrations: [absPathToMigrations],
});
