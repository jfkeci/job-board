import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { Session } from './session.entity';
import { RefreshToken } from './refresh-token.entity';
import { Organization } from './organization.entity';
import { Job } from './job.entity';
import { Application } from './application.entity';
import { SavedJob } from './saved-job.entity';
import { JobView } from './job-view.entity';
import { Category } from './category.entity';
import { CategoryTranslation } from './category-translation.entity';
import { Location } from './location.entity';
import { Payment } from './payment.entity';
import { CvCredit } from './cv-credit.entity';
import { File } from './file.entity';
import { SearchQuery } from './search-query.entity';

export {
  Tenant,
  User,
  UserProfile,
  Session,
  RefreshToken,
  Organization,
  Job,
  Application,
  SavedJob,
  JobView,
  Category,
  CategoryTranslation,
  Location,
  Payment,
  CvCredit,
  File,
  SearchQuery,
};

// All entities array for TypeORM configuration
export const entities = [
  Tenant,
  User,
  UserProfile,
  Session,
  RefreshToken,
  Organization,
  Job,
  Application,
  SavedJob,
  JobView,
  Category,
  CategoryTranslation,
  Location,
  Payment,
  CvCredit,
  File,
  SearchQuery,
];
