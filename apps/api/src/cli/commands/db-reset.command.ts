import * as readline from 'readline';

import { Command, CommandRunner, Option } from 'nest-commander';

import { SeederService } from '../../seeder';

interface DbResetOptions {
  force?: boolean;
}

@Command({
  name: 'db:reset',
  description: 'Purge all data and re-seed reference data',
})
export class DbResetCommand extends CommandRunner {
  constructor(private readonly seeder: SeederService) {
    super();
  }

  async run(_params: string[], options: DbResetOptions): Promise<void> {
    console.log('\n🔄 Database Reset\n');

    if (!options.force) {
      const confirmed = await this.confirmReset();
      if (!confirmed) {
        console.log('\n❌ Reset cancelled.\n');
        return;
      }
    }

    try {
      console.log('\n--- Step 1/2: Purging database ---\n');
      await this.seeder.purge();

      console.log('\n--- Step 2/2: Seeding reference data ---\n');
      await this.seeder.seedAll();

      console.log('\n✅ Database reset completed successfully!\n');

      // Show status after reset
      const status = await this.seeder.getStatus();
      console.log('📊 Current Status:');
      console.log(`   Tenants: ${status.tenants}`);
      console.log(`   Categories: ${status.categories}`);
      console.log(`   Category Translations: ${status.categoryTranslations}`);
      console.log(`   Locations: ${status.locations}\n`);
    } catch (error) {
      console.error('\n❌ Reset failed:', (error as Error).message);
      process.exit(1);
    }
  }

  private confirmReset(): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(
        '⚠️  WARNING: This will delete ALL data and re-seed reference data.\n' +
        '   Are you sure you want to continue? (yes/no): ',
        (answer) => {
          rl.close();
          resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
        },
      );
    });
  }

  @Option({
    flags: '-f, --force',
    description: 'Skip confirmation prompt',
  })
  parseForce(): boolean {
    return true;
  }
}
