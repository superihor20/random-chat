export const configDev = {
  port: process.env.PORT || 3000,
  clienUrl: process.env.CLIENT_URL || 'http://localhost:4200',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT && !Number.isNaN(+process.env.DB_PORT) ? +process.env.DB_PORT : 5432,
  dbUsername: process.env.DB_USERNAME || 'user',
  dbPassword: process.env.DB_PASSWORD || '123123123',
  dbName: process.env.DB_NAME || 'chat',
};
