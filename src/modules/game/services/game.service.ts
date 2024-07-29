import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from '../dtos/create-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import {
  createGameFourDrawLayout,
  createShuffledPositions,
  formatPositionTimeMap,
  getUserLocalTime,
  getNumberDraw,
} from 'src/common/utils/game.utils';
import { CreateGameUserDto } from '../dtos/create-game-user.dto';
import { positionTimeMap } from 'src/common/constants/constants';

import { Board } from 'src/modules/board/entities/board.entity';
import { BoardOrder } from '../entities/board-order.entity';
import { Game, Status } from '../entities/game.entity';
import { GameUser } from '../entities/game-user.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { UserDraw } from '../entities/user-draw.entity';

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
  async create(createGameDto: CreateGameDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Fetch related entities within the transaction
      const [board] = await Promise.all([
        queryRunner.manager.findOne(Board, {
          where: { id: createGameDto.boardId },
        }),
      ]);

      if (!board) {
        throw new NotFoundException('Board not found');
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

  async getUserGame(id: number, user: User) {
    console.debug({ user });
    const { name: timezoneName } = user.timezone;

    const userLocalTime = getUserLocalTime(timezoneName);

    const game = await this.getGameWithDateAndId(userLocalTime, id);

    // Check if user has playerNumberPick
    const gameUser = await this.gameUserRepository.findOne({
      where: { userId: user.id, gameId: game.id },
    });

    if (!gameUser) {
      throw new NotFoundException('Pick player numbers first');
    }

    // get user draws check if user draws exist
    const userDraws = await this.userDrawRepository
      .createQueryBuilder('userDraw')
      .where('userDraw.gameId = :gameId', { gameId: game.id })
      .andWhere('userDraw.userId = :userId', { userId: user.id })
      .orderBy('userDraw.id', 'DESC')
      .limit(4)
      .getMany();

    const userLocalHour = getUserLocalTime(timezoneName, 'H');
    const currentHour = +userLocalHour === 0 ? 24 : +userLocalHour;

    return createGameFourDrawLayout(currentHour, userDraws);
  }

  async activeGames(user: User) {
    console.debug({ user });
    const { name: timezoneName } = user.timezone;
    const userLocalTime = getUserLocalTime(timezoneName);

    const queryBuilder = this.gameRepository
      .createQueryBuilder('game')
      .where('game.status = :status', { status: 'active' })
      .andWhere('game.pickingDate <= :now', { now: userLocalTime })
      .andWhere('game.endDate > :now', { now: userLocalTime })
      .orderBy('game.id', 'DESC');

    // Log the query and parameters
    // const [query, parameters] = queryBuilder.getQueryAndParameters();
    // console.log('Generated SQL query:', query);
    // console.log('Query parameters:', parameters);

    // Execute the query
    const games = await queryBuilder.getMany();

    return games;
  }

  async createPlayerNumberPick(
    createGameUserDto: CreateGameUserDto,
    user: User,
  ) {
    // Check if game exists
    const game = await this.gameRepository.findOne({
      where: { id: createGameUserDto.gameId },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.status !== Status.ACTIVE) {
      throw new NotFoundException('Game is not active');
    }

    // Check playerNumbers length is equal to game.numberPicking
    if (createGameUserDto.playerNumbers.length !== game.numberPicking) {
      throw new NotFoundException('Invalid playerNumbers length');
    }

    const gameUser = this.gameUserRepository.create({
      ...createGameUserDto,
      user,
      game,
    });

    await this.gameUserRepository.save(gameUser);
    return gameUser;
  }

  async createPlayerDraw(gameId: number, user: User) {
    console.debug({ user });
    const { name: timezoneName } = user.timezone;

    // Get User Current Local Hour
    const currentHour = getUserLocalTime(timezoneName, 'H');
    const userLocalTime = getUserLocalTime(timezoneName);

    const game = await this.getGameWithDateAndId(userLocalTime, gameId);

    // Get playerNumbers
    const gameUser = await this.gameUserRepository.findOne({
      where: { gameId: game.id, userId: user.id },
    });

    if (!gameUser) {
      return 'Pick player numbers first';
    }

    // Get all the userDraws for this game
    const userDraws = await this.userDrawRepository.find({
      where: { gameId: game.id, userId: user.id },
    });

    // Check if currentHour is not in userDraws
    if (!userDraws.find((userDraw) => userDraw.drawTime === +currentHour)) {
      const numberDraw = getNumberDraw(userDraws, game.randomRepeatAllowed);

      // Get boardPosition from board orders
      const boardPosition = game.boardOrders.find(
        (boardOrder) => boardOrder.number === +numberDraw,
      ).position;

      // check if gameUser playerNumber has match

      const isMatch = gameUser.playerNumbers.includes(+numberDraw);

      const userDraw = this.userDrawRepository.create({
        numberDraw,
        drawTime: +currentHour,
        boardPosition,
        isDraw: true,
        drawAt: new Date(),
        isMatch,
        user,
        game,
      });

      await this.userDrawRepository.save(userDraw);

      return {
        data: {
          ...formatPositionTimeMap(positionTimeMap[+currentHour], numberDraw),
          isMatch,
        },
        message: 'Draw created successfully',
      };

      //TODO: Check for Winnings
    }

    return { message: 'Already drawn' };
  }

  async getGameWithDateAndId(userLocalTime: string, id: number) {
    // Check game exist
    const game = await this.gameRepository.findOne({
      relations: ['boardOrders'],
      where: {
        id,
        pickingDate: LessThan(new Date(userLocalTime)),
        endDate: MoreThan(new Date(userLocalTime)),
        status: Status.ACTIVE,
      },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game;
  }
}
