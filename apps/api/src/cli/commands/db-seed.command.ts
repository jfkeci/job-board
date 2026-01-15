import { Command, CommandRunner, Option } from 'nest-commander';

import { SeederService } from '../../seeder';

type SeedTarget = 'tenants' | 'categories' | 'locations';

interface DbSeedOptions {
  only?: SeedTarget;
}

@Command({
  name: 'db:seed',
  description: 'Seed reference data into the database',
})
export class DbSeedCommand extends CommandRunner {
  constructor(private readonly seeder: SeederService) {
    super();
  }

  async run(_params: string[], options: DbSeedOptions): Promise<void> {
    console.log('\n🌱 Database Seeder\n');

    try {
      if (options.only) {
        await this.seedOnly(options.only);
      } else {
        await this.seeder.seedAll();
      }

      console.log('\n✅ Seeding completed successfully!\n');

      // Show status after seeding
      const status = await this.seeder.getStatus();
      console.log('📊 Current Status:');
      console.log(`   Tenants: ${status.tenants}`);
      console.log(`   Categories: ${status.categories}`);
      console.log(`   Category Translations: ${status.categoryTranslations}`);
      console.log(`   Locations: ${status.locations}\n`);
    } catch (error) {
      console.error('\n❌ Seeding failed:', (error as Error).message);
      process.exit(1);
    }
  }

  private async seedOnly(target: SeedTarget): Promise<void> {
    console.log(`Seeding only: ${target}\n`);

    switch (target) {
      case 'tenants':
        await this.seeder.seedTenants();
        break;
      case 'categories':
        await this.seeder.seedCategories();
        break;
      case 'locations':
        await this.seeder.seedLocations();
        break;
      default:
        throw new Error(`Unknown seed target: ${target}`);
    }
  }

  @Option({
    flags: '--only <type>',
    description: 'Seed only specific data (tenants, categories, locations)',
  })
  parseOnly(val: string): SeedTarget {
    const valid: SeedTarget[] = ['tenants', 'categories', 'locations'];
    if (!valid.includes(val as SeedTarget)) {
      throw new Error(`Invalid seed target. Must be one of: ${valid.join(', ')}`);
    }
    return val as SeedTarget;
  }
}
