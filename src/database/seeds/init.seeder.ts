import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';
import TimezoneSeeder from './timezone.seeder';
import BoardSeeder from './board.seeder';

// TODO: turn off seeder when done to prevent data loss
export default class InitSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [TimezoneSeeder, BoardSeeder],
    });
  }
}