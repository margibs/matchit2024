import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/typeorm.config';

import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';
import { GameModule } from './modules/game/game.module';
import { UserModule } from './modules/user/user.module';
import { WinningCombinationModule } from './modules/winning-combination/winning-combination.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    GameModule,
    BoardModule,
    AuthModule,
    WinningCombinationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
