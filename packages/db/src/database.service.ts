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
    private readonly tenantRepo: Repository<Tenant>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(UserProfile)
    private readonly userProfileRepo: Repository<UserProfile>,

    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,

    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,

    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,

    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,

    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,

    @InjectRepository(SavedJob)
    private readonly savedJobRepo: Repository<SavedJob>,

    @InjectRepository(JobView)
    private readonly jobViewRepo: Repository<JobView>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(CategoryTranslation)
    private readonly categoryTranslationRepo: Repository<CategoryTranslation>,

    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(CvCredit)
    private readonly cvCreditRepo: Repository<CvCredit>,

    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}

  get tenants(): Repository<Tenant> {
    return this.tenantRepo;
  }

  get users(): Repository<User> {
    return this.userRepo;
  }

  get userProfiles(): Repository<UserProfile> {
    return this.userProfileRepo;
  }

  get sessions(): Repository<Session> {
    return this.sessionRepo;
  }

  get refreshTokens(): Repository<RefreshToken> {
    return this.refreshTokenRepo;
  }

  get organizations(): Repository<Organization> {
    return this.organizationRepo;
  }

  get jobs(): Repository<Job> {
    return this.jobRepo;
  }

  get applications(): Repository<Application> {
    return this.applicationRepo;
  }

  get savedJobs(): Repository<SavedJob> {
    return this.savedJobRepo;
  }

  get jobViews(): Repository<JobView> {
    return this.jobViewRepo;
  }

  get categories(): Repository<Category> {
    return this.categoryRepo;
  }

  get categoryTranslations(): Repository<CategoryTranslation> {
    return this.categoryTranslationRepo;
  }

  get locations(): Repository<Location> {
    return this.locationRepo;
  }

  get payments(): Repository<Payment> {
    return this.paymentRepo;
  }

  get cvCredits(): Repository<CvCredit> {
    return this.cvCreditRepo;
  }

  get files(): Repository<File> {
    return this.fileRepo;
  }
}
