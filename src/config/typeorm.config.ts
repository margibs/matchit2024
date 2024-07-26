import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import InitSeeder from 'src/database/seeds/init.seeder';

import * as dotenv from 'dotenv';
dotenv.config();

// TODO: find a way to use configService
export const config: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST_MANUAL,
  port: 5432,
  username: process.env.POSTGRES_USER_MANUAL,
  password: process.env.POSTGRES_PASSWORD_MANUAL,
  database: process.env.POSTGRES_DATABASE_MANUAL,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  seeds: [InitSeeder],
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
