import { ConfigService } from '@nestjs/config';
import {
  User,
  Game,
  GameUser,
  UserDraw,
  Board,
  BoardOrder,
  Timezone,
} from 'src/entities';
import { SeederOptions } from 'typeorm-extension';

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config = {
  useFactory: (
    configService: ConfigService,
  ): PostgresConnectionOptions & SeederOptions => {
    return {
      type: 'postgres',
      host: configService.get('POSTGRES_HOST'),
      port: 5432,
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DATABASE'),
      entities: [Board, BoardOrder, Game, GameUser, Timezone, User, UserDraw],
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
