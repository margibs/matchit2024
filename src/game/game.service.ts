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
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import {
  createGameFourDrawLayout,
  createShuffledPositions,
  formatPositionTimeMap,
  getUserLocalTime,
  getNumberDraw,
  positionTimeMap,
} from 'src/utils/game.utils';
import { CreateGameUserDto } from './dto/create-game-user.dto';
import { UpdateGameUserDto } from './dto/update-game-user.dto';

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

  async getUserGame(id: number, user: User) {
    // TODO: Replace timezone with user timezone
    const userLocalTime = getUserLocalTime('Asia/Manila');

    // TODO: Create a function for this
    const game = await this.gameRepository.findOne({
      relations: ['boardOrders'],
      where: {
        pickingDate: LessThan(new Date(userLocalTime)),
        endDate: MoreThan(new Date(userLocalTime)),
        id,
      },
    });

    if (!game) {
      return 'Game not found';
    }
    // TODO: END Create a function for this

    // get user draws check if user draws exist
    const userDraws = await this.userDrawRepository
      .createQueryBuilder('userDraw')
      .where('userDraw.gameId = :gameId', { gameId: game.id })
      .andWhere('userDraw.userId = :userId', { userId: user.id })
      .orderBy('userDraw.id', 'DESC')
      .limit(4)
      .getMany();

    // TODO: Replace timezone with user timezone
    const userLocalHour = getUserLocalTime('Asia/Manila', 'H');
    // const userLocalHour = getLocalTimeInHour('Europe/Berlin');

    const currentHour = +userLocalHour === 0 ? 24 : +userLocalHour;

    return createGameFourDrawLayout(currentHour, userDraws);
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    return this.gameRepository.update(id, updateGameDto);
  }

  async remove(id: number) {
    return await this.gameRepository.delete(id);
  }

  async activeGames(user: User) {
    // TODO: Get Timezone from user
    // const userLocalTime = getUserLocalTime('America/Los_Angeles');
    // const userLocalTime = getUserLocalTime('Europe/Berlin');
    const userLocalTime = getUserLocalTime('Asia/Manila');

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

  async createPlayerDraw(updateGameUserDto: UpdateGameUserDto, user: User) {
    // Get User Current Local Hour
    // TODO: Replace timezone with user timezone
    // TODO: Create a function for this
    const currentHour = getUserLocalTime('Asia/Manila', 'H');
    const userLocalTime = getUserLocalTime('Asia/Manila');

    // Check game exist
    const game = await this.gameRepository.findOne({
      relations: ['boardOrders'],
      where: {
        pickingDate: LessThan(new Date(userLocalTime)),
        endDate: MoreThan(new Date(userLocalTime)),
        id: updateGameUserDto.gameId,
      },
    });

    if (!game) {
      return 'Game not found';
    }
    // TODO: END Create a function for this

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
}
