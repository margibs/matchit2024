import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBoardDto } from '../dtos/create-board.dto';
import { UpdateBoardDto } from '../dtos/update-board.dto';

import { Board } from '../entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    const board = this.boardRepository.create(createBoardDto);
    return await this.boardRepository.save(board);
  }

  async findAll() {
    return await this.boardRepository.find();
  }

  async findOne(id: number) {
    return await this.boardRepository.findOne({ where: { id } });
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    await this.boardRepository.update(id, updateBoardDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.boardRepository.delete(id);
  }
}
