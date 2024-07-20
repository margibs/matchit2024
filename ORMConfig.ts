import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config = {
  useFactory: (configService: ConfigService): PostgresConnectionOptions => {
    return {
      type: 'postgres',
      host: configService.get('POSTGRES_HOST'),
      port: 5432,
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DATABASE'),
      entities: [],
      synchronize: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
  },
  inject: [ConfigService],
};

export default config;
