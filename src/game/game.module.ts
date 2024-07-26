import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game, GameUser, UserDraw } from 'src/entities';
import { User } from 'src/modules/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, GameUser, User, UserDraw])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
