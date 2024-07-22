import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game, GameUser, User, UserDraw } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Game, GameUser, User, UserDraw])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
