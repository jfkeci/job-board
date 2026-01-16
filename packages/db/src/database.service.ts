import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Application,
  Category,
  CategoryTranslation,
  CvCredit,
  File,
  Job,
  JobView,
  Location,
  Organization,
  Payment,
  RefreshToken,
  SavedJob,
  SearchQuery,
  Session,
  Tenant,
  User,
  UserProfile,
} from './entities';

/**
 * Database service providing facade access to all repositories
 * Eliminates the need to inject individual repositories in services
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class JobService {
 *   constructor(private readonly db: DatabaseService) {}
 *
 *   async findByTenant(tenantId: string) {
 *     return this.db.jobs.find({ where: { tenantId } });
 *   }
 * }
 * ```
 */
@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Tenant)
    public readonly tenants: Repository<Tenant>,

    @InjectRepository(User)
    public readonly users: Repository<User>,

    @InjectRepository(UserProfile)
    public readonly userProfiles: Repository<UserProfile>,

    @InjectRepository(Session)
    public readonly sessions: Repository<Session>,

    @InjectRepository(RefreshToken)
    public readonly refreshTokens: Repository<RefreshToken>,

    @InjectRepository(Organization)
    public readonly organizations: Repository<Organization>,

    @InjectRepository(Job)
    public readonly jobs: Repository<Job>,

    @InjectRepository(Application)
    public readonly applications: Repository<Application>,

    @InjectRepository(SavedJob)
    public readonly savedJobs: Repository<SavedJob>,

    @InjectRepository(JobView)
    public readonly jobViews: Repository<JobView>,

    @InjectRepository(Category)
    public readonly categories: Repository<Category>,

    @InjectRepository(CategoryTranslation)
    public readonly categoryTranslations: Repository<CategoryTranslation>,

    @InjectRepository(Location)
    public readonly locations: Repository<Location>,

    @InjectRepository(Payment)
    public readonly payments: Repository<Payment>,

    @InjectRepository(CvCredit)
    public readonly cvCredits: Repository<CvCredit>,

    @InjectRepository(File)
    public readonly files: Repository<File>,

    @InjectRepository(SearchQuery)
    public readonly searchQueries: Repository<SearchQuery>,
  ) {}
}
