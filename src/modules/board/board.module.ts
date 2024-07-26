import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardController } from './controllers/board.controller';
import { BoardService } from './services/board.service';

import { Board } from './entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
