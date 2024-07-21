import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board, BoardOrder, Game, GameUser, User } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardOrder, Game, GameUser, User]),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
