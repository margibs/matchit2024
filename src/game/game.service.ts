import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board, BoardOrder, Game, GameUser, Status, User } from 'src/entities';
import { DataSource, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { createShuffledPositions } from 'src/utils/game.utils';
import { CreateGameUserDto } from './dto/create-game-user.dto';

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
    @InjectRepository(GameUser)
    private readonly gameUserRepository: Repository<GameUser>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createGameDto: CreateGameDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Fetch related entities within the transaction
      // TODO: Replace user with current user after JWT + login implementation
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
    return await this.gameRepository.findOne({
      relations: ['boardOrders', 'gameUsers'],
      where: { id },
    });
  }

  async getUserGame(id: number) {
    // TODO: Replace user with current user after JWT + login implementation
    const user = await this.userRepository.findOne({
      where: { id: 1 },
    });

    const game = await this.gameRepository.findOne({
      relations: ['boardOrders', 'gameUsers'],
      where: { id },
    });

    const gameUser = await this.gameUserRepository.find({
      where: { gameId: id, userId: user.id },
    });

    return { game, gameUser };
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    return this.gameRepository.update(id, updateGameDto);
  }

  async remove(id: number) {
    return await this.gameRepository.delete(id);
  }

  async activeGames() {
    const now = new Date();

    // const games = await this.gameRepository
    //   .createQueryBuilder('game')
    //   .where('game.status = :status', { status: 'active' })
    //   .andWhere('game.pickingDate <= :now', { now })
    //   .andWhere('game.endDate > :now', { now })
    //   .orderBy('game.id', 'DESC')
    //   .getMany();

    const games = await this.gameRepository.find({
      where: {
        status: Status.ACTIVE,
        pickingDate: LessThanOrEqual(now),
        endDate: MoreThan(now),
      },
      order: {
        id: 'DESC',
      },
    });

    return games;
  }

  async createPlayerNumberPick(createGameUserDto: CreateGameUserDto) {
    // TODO: Replace user with current user after JWT + login implementation
    const user = await this.userRepository.findOne({
      where: { id: 1 },
    });

    // Check if game exists
    const game = await this.gameRepository.findOne({
      where: { id: createGameUserDto.gameId },
    });

    if (!game) {
      throw new Error('Game not found');
    }

    // Check if game is active
    if (game.status !== Status.ACTIVE) {
      throw new Error('Game is not active');
    }

    // Check playerNumbers length is equal to game.numberPicking
    if (createGameUserDto.playerNumbers.length !== game.numberPicking) {
      throw new Error('Invalid playerNumbers length');
    }

    const gameUser = this.gameUserRepository.create({
      ...createGameUserDto,
      user,
      game,
    });

    await this.gameUserRepository.save(gameUser);
    return gameUser;
  }
}
