import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board, BoardOrder, Game, User } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardOrder, Game, User])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
