import { Board } from 'src/modules/board/entities/board.entity';
import {
  WinningCombination,
  WinningCombinationStatus,
} from 'src/modules/winning-combination/entities/winning-combination.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

//TODO: Figure out how to re-seed without deleting the users
export default class WinningCombinationSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find the board by name
      const board = await queryRunner.manager.findOne(Board, {
        where: { name: 'Heart Shape Board' },
      });

      if (!board) {
        throw new Error('Heart Shape Board not found');
      }

      // Prepare winning combinations
      const winningCombinations = [
        {
          name: '3 in a row',
          positions: [
            [3, 4, 5],
            [6, 7, 8],
            [9, 10, 11],
            [10, 11, 12],
            [11, 12, 13],
            [12, 13, 14],
            [13, 14, 15],
            [16, 17, 18],
            [17, 18, 19],
            [18, 19, 20],
            [21, 22, 23],
            [1, 4, 10],
            [2, 7, 14],
            [4, 10, 16],
            [5, 11, 17],
            [6, 13, 19],
            [7, 14, 20],
            [11, 17, 21],
            [12, 18, 22],
            [13, 19, 23],
            [18, 22, 24],
            [1, 5, 12],
            [2, 6, 12],
            [3, 10, 17],
            [4, 11, 18],
            [5, 12, 19],
            [6, 12, 17],
            [7, 13, 18],
            [8, 14, 19],
            [9, 16, 21],
            [10, 17, 22],
            [11, 18, 23],
            [13, 18, 21],
            [14, 19, 22],
            [15, 20, 23],
            [16, 21, 24],
            [20, 23, 24],
          ],
          description: '3 in a row - horizontal, vertical or diagonal',
          board,
          price: 1.0,
          matchCount: 3,
          status: WinningCombinationStatus.INACTIVE,
        },
        {
          name: 'Box of 4',
          positions: [
            [3, 4, 9, 10],
            [4, 5, 10, 11],
            [6, 7, 13, 14],
            [7, 8, 14, 15],
            [10, 11, 16, 17],
            [11, 12, 17, 18],
            [12, 13, 18, 19],
            [13, 14, 19, 20],
            [17, 18, 21, 22],
            [18, 19, 22, 23],
          ],
          description: 'Box of 4',
          board: board,
          price: 1.0,
          matchCount: 4,
          status: WinningCombinationStatus.INACTIVE,
        },
        {
          name: '4 in a row',
          positions: [
            [9, 10, 11, 12],
            [10, 11, 12, 13],
            [11, 12, 13, 14],
            [12, 13, 14, 15],
            [16, 17, 18, 19],
            [17, 18, 19, 20],
            [1, 4, 10, 16],
            [2, 7, 14, 20],
            [5, 11, 17, 21],
            [6, 13, 19, 23],
            [12, 18, 22, 24],
            [1, 5, 12, 19],
            [2, 6, 12, 17],
            [3, 10, 17, 22],
            [4, 11, 18, 23],
            [7, 13, 18, 21],
            [8, 14, 19, 22],
            [9, 16, 21, 24],
            [15, 20, 23, 24],
          ],
          description: '4 in a row - horizontal, vertical or diagonal',
          board,
          price: 1.0,
          matchCount: 4,
          status: WinningCombinationStatus.INACTIVE,
        },
        {
          name: '5 in a row',
          positions: [
            [9, 10, 11, 12, 13],
            [10, 11, 12, 13, 14],
            [11, 12, 13, 14, 15],
            [16, 17, 18, 19, 20],
          ],
          description: '5 in a row - horizontal',
          board,
          price: 1.0,
          matchCount: 5,
          status: WinningCombinationStatus.INACTIVE,
        },
        {
          name: 'Block of 6',
          positions: [
            [4, 5, 10, 11, 16, 17],
            [6, 7, 13, 14, 19, 20],
            [6, 7, 8, 13, 14, 15],
            [10, 11, 12, 16, 17, 18],
            [11, 12, 17, 18, 21, 22],
            [11, 12, 13, 17, 18, 19],
            [12, 13, 14, 18, 19, 20],
            [12, 13, 18, 19, 22, 23],
            [17, 18, 19, 21, 22, 23],
          ],
          description: 'Block of 6',
          board,
          price: 10.0,
          matchCount: 6,
          status: WinningCombinationStatus.INACTIVE,
        },
        {
          name: '6 in a row',
          positions: [
            [9, 10, 11, 12, 13, 14],
            [10, 11, 12, 13, 14, 15],
          ],
          description: '6 in a row - horizontal',
          board,
          price: 10.0,
          matchCount: 6,
          status: WinningCombinationStatus.INACTIVE,
        },
        {
          name: '7 in a row',
          positions: [[9, 10, 11, 12, 13, 14, 15]],
          description: '7 in a row - horizontal',
          board,
          price: 25.0,
          matchCount: 7,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: 'Outer Points',
          positions: [[1, 2, 3, 8, 9, 15, 24]],
          description: 'Outer Points',
          board,
          price: 10.0,
          matchCount: 7,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: 'Y Seven number Game',
          positions: [[1, 2, 5, 6, 12, 18, 22]],
          description: 'Y Seven number Game',
          board,
          price: 40.0,
          matchCount: 7,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: 'Y Eight number Game',
          positions: [[1, 2, 5, 6, 12, 18, 22, 24]],
          description: 'Y Eight number Game',
          board,
          price: 75.0,
          matchCount: 8,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: 'Bulls Eye',
          positions: [[11, 12, 13, 17, 19, 21, 22, 23]],
          description: 'Bulls Eye',
          board,
          price: 50.0,
          matchCount: 8,
          status: WinningCombinationStatus.ACTIVE,
        },
      ];

      // TODO: Double check logic for these patterns
      const winningCombinations2 = [
        {
          name: '7 Pattern Number #1',
          positions: [[1, 2, 5, 6, 12, 17, 19]],
          description: '7-1 Pattern',
          board,
          price: 1.0,
          matchCount: 7,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '7 Pattern Number #2',
          positions: [[4, 7, 11, 13, 18, 21, 23]],
          description: '7-11 Pattern',
          board,
          price: 1.0,
          matchCount: 7,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '9 Pattern Number #1',
          positions: [[1, 2, 5, 6, 12, 17, 19, 21, 23]],
          description: '9-2 Pattern',
          board,
          price: 10.0,
          matchCount: 9,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '9 Pattern Number #2',
          positions: [[11, 12, 13, 17, 18, 19, 21, 22, 23]],
          description: '9-6 Pattern',
          board,
          price: 10.0,
          matchCount: 9,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '9 Pattern Number #3',
          positions: [[16, 17, 18, 19, 20, 21, 22, 23, 24]],
          description: '9-13 Pattern',
          board,
          price: 10.0,
          matchCount: 9,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '9 Pattern Number #4',
          positions: [[3, 4, 5, 10, 11, 12, 17, 18, 19]],
          description: '9-20 Pattern',
          board,
          price: 10.0,
          matchCount: 9,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '10 Pattern Number #1',
          positions: [[1, 2, 5, 6, 12, 17, 19, 21, 23, 24]],
          description: '10-3 Pattern',
          board,
          price: 50.0,
          matchCount: 10,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '10 Pattern Number #2',
          positions: [[9, 10, 11, 12, 13, 14, 15, 18, 22, 24]],
          description: '10-5 Pattern',
          board,
          price: 50.0,
          matchCount: 10,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '10 Pattern Number #3',
          positions: [[10, 11, 12, 13, 14, 16, 17, 18, 19, 20]],
          description: '10-12 Pattern',
          board,
          price: 50.0,
          matchCount: 10,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '10 Pattern Number #4',
          positions: [[9, 10, 11, 12, 13, 14, 15, 17, 18, 19]],
          description: '10-21 Pattern',
          board,
          price: 50.0,
          matchCount: 10,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '11 Pattern Number #1',
          positions: [[1, 2, 3, 8, 9, 12, 15, 16, 20, 21, 23]],
          description: '11-8 Pattern',
          board,
          price: 250.0,
          matchCount: 11,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '11 Pattern Number #2',
          positions: [[1, 2, 3, 8, 9, 15, 16, 20, 21, 23, 24]],
          description: '11-9 Pattern',
          board,
          price: 250.0,
          matchCount: 11,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '11 Pattern Number #3',
          positions: [[1, 2, 3, 5, 6, 8, 9, 11, 12, 13, 15]],
          description: '11-16 Pattern',
          board,
          price: 250.0,
          matchCount: 11,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '12 Pattern Number #1',
          positions: [[1, 2, 4, 7, 10, 11, 12, 13, 14, 18, 22, 24]],
          description: '12-4 Pattern',
          board,
          price: 500.0,
          matchCount: 12,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '12 Pattern Number #2',
          positions: [[4, 7, 11, 12, 13, 16, 17, 18, 19, 20, 22, 24]],
          description: '12-10 Pattern',
          board,
          price: 500.0,
          matchCount: 12,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '12 Pattern Number #3',
          positions: [[3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15]],
          description: '12-14 Pattern',
          board,
          price: 500.0,
          matchCount: 12,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '12 Pattern Number #4',
          positions: [[3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18]],
          description: '12-15 Pattern',
          board,
          price: 500.0,
          matchCount: 12,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '12 Pattern Number #5',
          positions: [[1, 2, 3, 5, 6, 8, 10, 12, 14, 17, 19, 22]],
          description: '12-17 Pattern',
          board,
          price: 500.0,
          matchCount: 12,
          status: WinningCombinationStatus.ACTIVE,
        },
        {
          name: '12 Pattern Number #6',
          positions: [[1, 2, 3, 4, 7, 8, 9, 10, 14, 15, 16, 20]],
          description: '12-18 Pattern',
          board,
          price: 500.0,
          matchCount: 12,
          status: WinningCombinationStatus.ACTIVE,
        },
      ];

      // Truncate the table
      await queryRunner.query(
        `TRUNCATE TABLE winning_combinations RESTART IDENTITY CASCADE`,
      );

      // Bulk insert the timezones
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(WinningCombination)
        .values([...winningCombinations, ...winningCombinations2])
        .execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
