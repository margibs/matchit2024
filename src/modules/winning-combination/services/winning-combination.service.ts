import { Injectable } from '@nestjs/common';
import { CreateWinningCombinationDto } from '../dtos/create-winning-combination.dto';
import { UpdateWinningCombinationDto } from '../dtos/update-winning-combination.dto';

@Injectable()
export class WinningCombinationService {
  create(createWinningCombinationDto: CreateWinningCombinationDto) {
    return 'This action adds a new winningCombination';
  }

  findAll() {
    return `This action returns all winningCombination`;
  }

  findOne(id: number) {
    return `This action returns a #${id} winningCombination`;
  }

  update(id: number, updateWinningCombinationDto: UpdateWinningCombinationDto) {
    return `This action updates a #${id} winningCombination`;
  }

  remove(id: number) {
    return `This action removes a #${id} winningCombination`;
  }
}
