import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Category, DatabaseService, Location, Tenant } from '@borg/db';

import {
  categoriesData,
  CategorySeedData,
  locationsData,
  LocationSeedData,
  tenantsData,
} from './data';

export interface SeederStatus {
  tenants: number;
  categories: number;
  categoryTranslations: number;
  locations: number;
}

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Get current seed status (record counts)
   */
  async getStatus(): Promise<SeederStatus> {
    const [tenants, categories, categoryTranslations, locations] = await Promise.all([
      this.db.tenants.count(),
      this.db.categories.count(),
      this.db.categoryTranslations.count(),
      this.db.locations.count(),
    ]);

    return { tenants, categories, categoryTranslations, locations };
  }

  /**
   * Purge all data from the database
   * Truncates tables in correct order to respect FK constraints
   */
  async purge(): Promise<void> {
    this.logger.log('Purging database...');

    // Order matters for FK constraints (most dependent first)
    const tables = [
      'refresh_tokens',
      'sessions',
      'job_views',
      'saved_jobs',
      'applications',
      'cv_credits',
      'payments',
      'jobs',
      'user_profiles',
      'users',
      'organizations',
      'category_translations',
      'categories',
      'locations',
      'files',
      'tenants',
    ];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Disable FK checks for truncation
      await queryRunner.query('SET session_replication_role = replica;');

      for (const table of tables) {
        try {
          await queryRunner.query(`TRUNCATE TABLE "${table}" CASCADE;`);
          this.logger.debug(`Truncated table: ${table}`);
        } catch (error) {
          // Table might not exist, skip
          this.logger.warn(`Could not truncate table ${table}: ${(error as Error).message}`);
        }
      }

      // Re-enable FK checks
      await queryRunner.query('SET session_replication_role = DEFAULT;');

      this.logger.log('Database purged successfully');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Seed all reference data in correct order
   */
  async seedAll(): Promise<void> {
    this.logger.log('Seeding all reference data...');

    await this.seedTenants();
    await this.seedCategories();
    await this.seedLocations();

    this.logger.log('All reference data seeded successfully');
  }

  /**
   * Seed tenant records
   */
  async seedTenants(): Promise<Tenant[]> {
    const existing = await this.db.tenants.find();
    if (existing.length > 0) {
      this.logger.log(`Tenants already seeded (${existing.length} found), skipping...`);
      return existing;
    }

    this.logger.log('Seeding tenants...');

    const tenants: Tenant[] = [];
    for (const data of tenantsData) {
      const { id, ...rest } = data;
      const tenant = this.db.tenants.create({
        ...rest,
        ...(id && { id }),
      });
      const saved = await this.db.tenants.save(tenant);
      tenants.push(saved);
      this.logger.debug(`Created tenant: ${saved.name} (${saved.code}) - ${saved.id}`);
    }

    this.logger.log(`Seeded ${tenants.length} tenants`);
    return tenants;
  }

  /**
   * Seed categories with translations (global categories with tenantId = null)
   */
  async seedCategories(): Promise<Category[]> {
    const existing = await this.db.categories.find();
    if (existing.length > 0) {
      this.logger.log(`Categories already seeded (${existing.length} found), skipping...`);
      return existing;
    }

    this.logger.log('Seeding categories...');

    const categories: Category[] = [];
    for (const data of categoriesData) {
      const category = await this.createCategoryWithChildren(data, null);
      categories.push(category);
    }

    this.logger.log(`Seeded ${categories.length} root categories`);
    return categories;
  }

  /**
   * Recursively create a category with its children and translations
   */
  private async createCategoryWithChildren(
    data: CategorySeedData,
    parentId: string | null,
  ): Promise<Category> {
    // Create category (global - tenantId is null)
    const category = this.db.categories.create({
      slug: data.slug,
      tenantId: null,
      parentId,
    });
    const savedCategory = await this.db.categories.save(category);

    // Create translations
    for (const [language, name] of Object.entries(data.translations)) {
      const translation = this.db.categoryTranslations.create({
        categoryId: savedCategory.id,
        language,
        name,
      });
      await this.db.categoryTranslations.save(translation);
    }

    this.logger.debug(`Created category: ${data.slug}`);

    // Create children recursively
    if (data.children) {
      for (const childData of data.children) {
        await this.createCategoryWithChildren(childData, savedCategory.id);
      }
    }

    return savedCategory;
  }

  /**
   * Seed locations for all tenants
   */
  async seedLocations(): Promise<Location[]> {
    const existing = await this.db.locations.find();
    if (existing.length > 0) {
      this.logger.log(`Locations already seeded (${existing.length} found), skipping...`);
      return existing;
    }

    this.logger.log('Seeding locations...');

    const tenants = await this.db.tenants.find();
    if (tenants.length === 0) {
      this.logger.warn('No tenants found. Please seed tenants first.');
      return [];
    }

    const locations: Location[] = [];
    for (const tenant of tenants) {
      const tenantLocations = locationsData[tenant.code];
      if (!tenantLocations) {
        this.logger.warn(`No location data found for tenant: ${tenant.code}`);
        continue;
      }

      for (const locationData of tenantLocations) {
        const location = await this.createLocationWithChildren(locationData, tenant.id, null);
        locations.push(location);
      }
    }

    this.logger.log(`Seeded ${locations.length} root locations`);
    return locations;
  }

  /**
   * Recursively create a location with its children
   */
  private async createLocationWithChildren(
    data: LocationSeedData,
    tenantId: string,
    parentId: string | null,
  ): Promise<Location> {
    const location = this.db.locations.create({
      tenantId,
      parentId,
      type: data.type,
      slug: data.slug,
      name: data.name,
    });
    const savedLocation = await this.db.locations.save(location);

    this.logger.debug(`Created location: ${data.name} (${data.type})`);

    // Create children recursively
    if (data.children) {
      for (const childData of data.children) {
        await this.createLocationWithChildren(childData, tenantId, savedLocation.id);
      }
    }

    return savedLocation;
  }
}
