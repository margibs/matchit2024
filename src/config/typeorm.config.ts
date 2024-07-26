import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

const config = {
  useFactory: (configService: ConfigService): DataSourceOptions => {
    return {
      type: 'postgres',
      host: configService.get('POSTGRES_HOST'),
      port: 5432,
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DATABASE'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
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
