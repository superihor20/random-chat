import { DataSource } from 'typeorm';

import { configDev } from './config.dev';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configDev.dbHost,
  port: configDev.dbPort,
  username: configDev.dbUsername,
  password: configDev.dbPassword,
  database: configDev.dbName,
  logging: true,
  synchronize: false,
  entities: [],
  migrations: [],
});
