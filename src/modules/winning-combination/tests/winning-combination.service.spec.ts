import { Test, TestingModule } from '@nestjs/testing';
import { WinningCombinationService } from '../winning-combination.service';

describe('WinningCombinationService', () => {
  let service: WinningCombinationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WinningCombinationService],
    }).compile();

    service = module.get<WinningCombinationService>(WinningCombinationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
