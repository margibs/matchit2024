import { Board } from 'src/modules/board/entities/board.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

//TODO: Figure out how to re-seed without deleting the users
export default class BoardSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const boards = [{ name: 'Heart Shape Board', boardSize: 24 }];

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Truncate the table
      await queryRunner.query(`TRUNCATE TABLE board RESTART IDENTITY CASCADE`);

      // Bulk insert the timezones
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Board)
        .values(boards)
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
