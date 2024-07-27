import { Module } from '@nestjs/common';
import { WinningCombinationController } from './controllers/winning-combination.controller';
import { WinningCombinationService } from './services/winning-combination.service';

@Module({
  controllers: [WinningCombinationController],
  providers: [WinningCombinationService],
})
export class WinningCombinationModule {}
