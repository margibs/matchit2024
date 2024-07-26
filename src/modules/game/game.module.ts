import { Module } from '@nestjs/common';
import { GameService } from './services/game.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { GameUser, UserDraw } from 'src/entities';
import { User } from 'src/modules/user/entities/user.entity';
import { GameController } from './controllers/game.controller';
import { Game } from './entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, GameUser, User, UserDraw])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
