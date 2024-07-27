import { Module } from '@nestjs/common';
import { WinningCombinationService } from './winning-combination.service';
import { WinningCombinationController } from './winning-combination.controller';

@Module({
  controllers: [WinningCombinationController],
  providers: [WinningCombinationService],
})
export class WinningCombinationModule {}
