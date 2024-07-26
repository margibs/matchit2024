import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

// TODO: find a way to use configService
export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
  synchronize: false,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

const dataSource = new DataSource(config);
export default dataSource;

// host: process.env.POSTGRES_HOST,
// port: 5432,
// username: process.env.POSTGRES_USER,
// password: process.env.POSTGRES_PASSWORD,
// database: process.env.POSTGRES_DATABASE,

// host: process.env.POSTGRES_HOST_MANUAL,
// port: 5432,
// username: process.env.POSTGRES_USER_MANUAL,
// password: process.env.POSTGRES_PASSWORD_MANUAL,
// database: process.env.POSTGRES_DATABASE_MANUAL,
