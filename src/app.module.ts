import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'OrmConfig';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(config),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    GameModule,
    BoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
