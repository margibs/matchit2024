import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Board,
  BoardOrder,
  Game,
  GameUser,
  Status,
  User,
  UserDraw,
} from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import {
  createGameFourDrawLayout,
  createShuffledPositions,
} from 'src/utils/game.utils';
import { CreateGameUserDto } from './dto/create-game-user.dto';

import { format, toZonedTime } from 'date-fns-tz';
import * as moment from 'moment-timezone';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GameUser)
    private readonly gameUserRepository: Repository<GameUser>,
    @InjectRepository(UserDraw)
    private readonly userDrawRepository: Repository<UserDraw>,
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
      relations: ['boardOrders'],
      where: { id },
    });

    const gameUser = await this.gameUserRepository.find({
      where: { gameId: id, userId: user.id },
    });

    // TODO: Get Timezone from user
    const timeWithTimeZone = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Manila',
    });

    const currentHour =
      new Date(timeWithTimeZone).getHours() === 0
        ? 24
        : new Date(timeWithTimeZone).getHours();

    // get user draws check if user draws exist
    const userDraws = await this.userDrawRepository
      .createQueryBuilder('userDraw')
      .where('userDraw.gameId = :gameId', { gameId: game.id })
      .andWhere('userDraw.userId = :userId', { userId: user.id })
      .andWhere('userDraw.drawTime = :drawTime', { drawTime: currentHour })
      .orderBy('userDraw.id', 'DESC')
      .limit(4)
      .getMany();

    const numberDraws = [
      userDraws[0]?.numberDraw,
      userDraws[1]?.numberDraw,
      userDraws[2]?.numberDraw,
      userDraws[3]?.numberDraw,
    ];

    // return userDraws;
    return createGameFourDrawLayout(currentHour, numberDraws);
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    return this.gameRepository.update(id, updateGameDto);
  }

  async remove(id: number) {
    return await this.gameRepository.delete(id);
  }

  async activeGames() {
    // TODO: Get Timezone from user
    const now = moment(new Date());
    const americaLa = now.tz('America/Los_Angeles').format();
    const euroBerlin = now.tz('Europe/Berlin').format();
    const philippines = now.tz('Asia/Manila').format();
    console.debug('Different Timezones: ', {
      americaLa,
      euroBerlin,
      philippines,
    });

    const queryBuilder = this.gameRepository
      .createQueryBuilder('game')
      .where('game.status = :status', { status: 'active' })
      .andWhere('game.pickingDate <= :now', { now: euroBerlin })
      .andWhere('game.endDate > :now', { now: euroBerlin })
      .orderBy('game.id', 'DESC');

    // Log the query and parameters
    // const [query, parameters] = queryBuilder.getQueryAndParameters();
    // console.log('Generated SQL query:', query);
    // console.log('Query parameters:', parameters);

    // Execute the query
    const games = await queryBuilder.getMany();

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

    // TODO: Replace throw with proper error
    if (!game) {
      throw new Error('Game not found');
    }

    // Check if game is active
    // TODO: Replace throw with proper error
    if (game.status !== Status.ACTIVE) {
      throw new Error('Game is not active');
    }

    // Check playerNumbers length is equal to game.numberPicking
    // TODO: Replace throw with proper error
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
