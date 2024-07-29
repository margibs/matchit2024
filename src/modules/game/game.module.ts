import { Module } from '@nestjs/common';
import { GameService } from './services/game.service';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Game } from './entities/game.entity';
import { GameController } from './controllers/game.controller';
import { GameUser } from './entities/game-user.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { UserDraw } from './entities/user-draw.entity';
import { WinningCombination } from '../winning-combination/entities/winning-combination.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Game,
      GameUser,
      User,
      UserDraw,
      WinningCombination,
    ]),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
