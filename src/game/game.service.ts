import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board, BoardOrder, Game, User } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { createShuffledPositions } from 'src/utils/game.utils';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardOrder)
    private readonly boardOrderRepository: Repository<BoardOrder>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createGameDto: CreateGameDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Fetch related entities within the transaction
      const [user, board] = await Promise.all([
        queryRunner.manager.findOne(User, { where: { id: 1 } }),
        queryRunner.manager.findOne(Board, { where: { id: 1 } }),
      ]);

      if (!user || !board) {
        throw new Error('User or Board not found');
      }

      // Create and save the game
      const game = this.gameRepository.create({
        ...createGameDto,
        createdBy: user,
        board,
      });

      await queryRunner.manager.save(game);

      // Create and insert board orders
      const shuffledPositions = createShuffledPositions();
      const boardOrders = shuffledPositions.map((shuffledPosition) => ({
        position: shuffledPosition.position,
        number: shuffledPosition.number,
        game: game,
      }));

      await queryRunner.manager.insert(BoardOrder, boardOrders);

      // Commit the transaction
      await queryRunner.commitTransaction();

      return game;
    } catch (error) {
      // Rollback the transaction in case of errors
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.gameRepository.find();
  }

  async findOne(id: number) {
    return this.gameRepository.findOne({
      relations: [
        'board',
        'boardOrders',
        'createdBy',
        'gameUsers',
        'userDraws',
      ],
      where: { id },
    });
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    return this.gameRepository.update(id, updateGameDto);
  }

  async remove(id: number) {
    return await this.gameRepository.delete(id);
  }
}
