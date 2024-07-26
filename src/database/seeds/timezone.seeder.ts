import { Timezone } from 'src/modules/user/entities/timezone.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class TimezoneSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const timezones = [
      { name: 'Africa/Abidjan', offset: '+00:00' },
      { name: 'Africa/Accra', offset: '+00:00' },
      { name: 'Africa/Addis_Ababa', offset: '+03:00' },
      { name: 'Africa/Algiers', offset: '+01:00' },
      { name: 'Africa/Cairo', offset: '+02:00' },
      { name: 'Africa/Casablanca', offset: '+01:00' },
      { name: 'Africa/Johannesburg', offset: '+02:00' },
      { name: 'Africa/Lagos', offset: '+01:00' },
      { name: 'Africa/Nairobi', offset: '+03:00' },
      { name: 'Africa/Tunis', offset: '+01:00' },
      { name: 'America/Anchorage', offset: '-09:00' },
      { name: 'America/Argentina/Buenos_Aires', offset: '-03:00' },
      { name: 'America/Bogota', offset: '-05:00' },
      { name: 'America/Caracas', offset: '-04:00' },
      { name: 'America/Chicago', offset: '-06:00' },
      { name: 'America/Denver', offset: '-07:00' },
      { name: 'America/Godthab', offset: '-03:00' },
      { name: 'America/Halifax', offset: '-04:00' },
      { name: 'America/Havana', offset: '-05:00' },
      { name: 'America/Los_Angeles', offset: '-08:00' },
      { name: 'America/Mexico_City', offset: '-06:00' },
      { name: 'America/New_York', offset: '-05:00' },
      { name: 'America/Phoenix', offset: '-07:00' },
      { name: 'America/Santiago', offset: '-04:00' },
      { name: 'America/Sao_Paulo', offset: '-03:00' },
      { name: 'America/St_Johns', offset: '-03:30' },
      { name: 'America/Toronto', offset: '-05:00' },
      { name: 'America/Vancouver', offset: '-08:00' },
      { name: 'Asia/Bangkok', offset: '+07:00' },
      { name: 'Asia/Dubai', offset: '+04:00' },
      { name: 'Asia/Hong_Kong', offset: '+08:00' },
      { name: 'Asia/Jakarta', offset: '+07:00' },
      { name: 'Asia/Jerusalem', offset: '+02:00' },
      { name: 'Asia/Karachi', offset: '+05:00' },
      { name: 'Asia/Kolkata', offset: '+05:30' },
      { name: 'Asia/Kuwait', offset: '+03:00' },
      { name: 'Asia/Manila', offset: '+08:00' },
      { name: 'Asia/Riyadh', offset: '+03:00' },
      { name: 'Asia/Seoul', offset: '+09:00' },
      { name: 'Asia/Shanghai', offset: '+08:00' },
      { name: 'Asia/Singapore', offset: '+08:00' },
      { name: 'Asia/Taipei', offset: '+08:00' },
      { name: 'Asia/Tehran', offset: '+03:30' },
      { name: 'Asia/Tokyo', offset: '+09:00' },
      { name: 'Atlantic/Reykjavik', offset: '+00:00' },
      { name: 'Australia/Adelaide', offset: '+09:30' },
      { name: 'Australia/Brisbane', offset: '+10:00' },
      { name: 'Australia/Darwin', offset: '+09:30' },
      { name: 'Australia/Hobart', offset: '+10:00' },
      { name: 'Australia/Melbourne', offset: '+10:00' },
      { name: 'Australia/Perth', offset: '+08:00' },
      { name: 'Australia/Sydney', offset: '+10:00' },
      { name: 'Europe/Amsterdam', offset: '+01:00' },
      { name: 'Europe/Athens', offset: '+02:00' },
      { name: 'Europe/Belgrade', offset: '+01:00' },
      { name: 'Europe/Berlin', offset: '+01:00' },
      { name: 'Europe/Brussels', offset: '+01:00' },
      { name: 'Europe/Bucharest', offset: '+02:00' },
      { name: 'Europe/Budapest', offset: '+01:00' },
      { name: 'Europe/Copenhagen', offset: '+01:00' },
      { name: 'Europe/Dublin', offset: '+00:00' },
      { name: 'Europe/Helsinki', offset: '+02:00' },
      { name: 'Europe/Istanbul', offset: '+03:00' },
      { name: 'Europe/Kiev', offset: '+02:00' },
      { name: 'Europe/Lisbon', offset: '+00:00' },
      { name: 'Europe/London', offset: '+00:00' },
      { name: 'Europe/Madrid', offset: '+01:00' },
      { name: 'Europe/Moscow', offset: '+03:00' },
      { name: 'Europe/Oslo', offset: '+01:00' },
      { name: 'Europe/Paris', offset: '+01:00' },
      { name: 'Europe/Prague', offset: '+01:00' },
      { name: 'Europe/Rome', offset: '+01:00' },
      { name: 'Europe/Stockholm', offset: '+01:00' },
      { name: 'Europe/Vienna', offset: '+01:00' },
      { name: 'Europe/Warsaw', offset: '+01:00' },
      { name: 'Europe/Zurich', offset: '+01:00' },
      { name: 'Pacific/Auckland', offset: '+12:00' },
      { name: 'Pacific/Fiji', offset: '+12:00' },
      { name: 'Pacific/Honolulu', offset: '-10:00' },
      { name: 'UTC', offset: '+00:00' },
    ];

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Truncate the table
      await queryRunner.query(
        `TRUNCATE TABLE timezone RESTART IDENTITY CASCADE`,
      );

      // Bulk insert the timezones
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Timezone)
        .values(timezones)
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
