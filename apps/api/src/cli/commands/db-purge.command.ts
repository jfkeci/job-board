import * as readline from 'readline';

import { Command, CommandRunner, Option } from 'nest-commander';

import { SeederService } from '../../seeder';

interface DbPurgeOptions {
  force?: boolean;
}

@Command({
  name: 'db:purge',
  description: 'Purge all data from the database',
})
export class DbPurgeCommand extends CommandRunner {
  constructor(private readonly seeder: SeederService) {
    super();
  }

  async run(_params: string[], options: DbPurgeOptions): Promise<void> {
    console.log('\n🗑️  Database Purge\n');

    // Show current status
    const status = await this.seeder.getStatus();
    console.log('Current database contents:');
    console.log(`   Tenants: ${status.tenants}`);
    console.log(`   Categories: ${status.categories}`);
    console.log(`   Category Translations: ${status.categoryTranslations}`);
    console.log(`   Locations: ${status.locations}\n`);

    if (!options.force) {
      const confirmed = await this.confirmPurge();
      if (!confirmed) {
        console.log('\n❌ Purge cancelled.\n');
        return;
      }
    }

    try {
      console.log('\nPurging database...\n');
      await this.seeder.purge();
      console.log('\n✅ Database purged successfully!\n');
    } catch (error) {
      console.error('\n❌ Purge failed:', (error as Error).message);
      process.exit(1);
    }
  }

  private confirmPurge(): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(
        '⚠️  WARNING: This will delete ALL data from the database.\n' +
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
