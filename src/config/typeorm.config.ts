import { ConfigService } from '@nestjs/config';
import { GameUser, UserDraw, BoardOrder, Timezone } from 'src/entities';
import { Board } from 'src/modules/board/entities/board.entity';
import { Game } from 'src/modules/game/entities/game.entity';
import { User } from 'src/modules/user/entities/user.entity';
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
