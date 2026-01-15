import { Command, CommandRunner } from 'nest-commander';

import { SeederService } from '../../seeder';

@Command({
  name: 'db:status',
  description: 'Show current database seed status',
})
export class DbStatusCommand extends CommandRunner {
  constructor(private readonly seeder: SeederService) {
    super();
  }

  async run(): Promise<void> {
    console.log('\n📊 Database Seed Status\n');
    console.log('━'.repeat(40));

    const status = await this.seeder.getStatus();

    console.log(`  Tenants:               ${status.tenants}`);
    console.log(`  Categories:            ${status.categories}`);
    console.log(`  Category Translations: ${status.categoryTranslations}`);
    console.log(`  Locations:             ${status.locations}`);

    console.log('━'.repeat(40));

    const isEmpty =
      status.tenants === 0 &&
      status.categories === 0 &&
      status.locations === 0;

    if (isEmpty) {
      console.log('\n⚠️  Database is empty. Run `pnpm cli db:seed` to seed reference data.\n');
    } else {
      console.log('\n✅ Database has reference data.\n');
    }
  }
}
