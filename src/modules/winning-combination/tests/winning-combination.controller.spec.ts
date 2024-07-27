import { Test, TestingModule } from '@nestjs/testing';
import { WinningCombinationController } from '../controllers/winning-combination.controller';
import { WinningCombinationService } from '../services/winning-combination.service';

describe('WinningCombinationController', () => {
  let controller: WinningCombinationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WinningCombinationController],
      providers: [WinningCombinationService],
    }).compile();

    controller = module.get<WinningCombinationController>(
      WinningCombinationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
