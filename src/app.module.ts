import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from 'src/config/typeorm.config';

import { AuthModule } from './auth/auth.module';

import { UserModule } from './modules/user/user.module';
import { GameModule } from './modules/game/game.module';
import { BoardModule } from './modules/board/board.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(config),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    GameModule,
    BoardModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
