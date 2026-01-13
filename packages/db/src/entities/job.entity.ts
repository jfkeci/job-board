import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  EmploymentType,
  ExperienceLevel,
  JobStatus,
  JobTier,
  PromotionType,
  RemoteOption,
  SalaryPeriod,
} from '../enums';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;

  @Column({ type: 'uuid', name: 'organization_id' })
  organizationId: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  requirements: string | null;

  @Column({ type: 'text', nullable: true })
  benefits: string | null;

  @Column({ type: 'uuid', name: 'category_id' })
  categoryId: string;

  @Column({ type: 'uuid', name: 'location_id', nullable: true })
  locationId: string | null;

  @Column({ name: 'employment_type', type: 'enum', enum: EmploymentType })
  employmentType: EmploymentType;

  @Column({ name: 'remote_option', type: 'enum', enum: RemoteOption })
  remoteOption: RemoteOption;

  @Column({ name: 'experience_level', type: 'enum', enum: ExperienceLevel, nullable: true })
  experienceLevel: ExperienceLevel | null;

  @Column({ type: 'int', name: 'salary_min', nullable: true })
  salaryMin: number | null;

  @Column({ type: 'int', name: 'salary_max', nullable: true })
  salaryMax: number | null;

  @Column({ type: 'varchar', name: 'salary_currency', default: 'EUR' })
  salaryCurrency: string;

  @Column({ name: 'salary_period', type: 'enum', enum: SalaryPeriod, default: SalaryPeriod.MONTHLY })
  salaryPeriod: SalaryPeriod;

  @Column({ type: 'enum', enum: JobTier, default: JobTier.BASIC })
  tier: JobTier;

  @Column('simple-array', { default: '' })
  promotions: PromotionType[];

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.DRAFT })
  status: JobStatus;

  @Column({ type: 'timestamp', name: 'published_at', nullable: true })
  publishedAt: Date | null;

  @Column({ type: 'timestamp', name: 'expires_at', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'int', name: 'view_count', default: 0 })
  viewCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne('Tenant', 'jobs')
  @JoinColumn({ name: 'tenant_id' })
  tenant: import('./tenant.entity').Tenant;

  @ManyToOne('Organization', 'jobs')
  @JoinColumn({ name: 'organization_id' })
  organization: import('./organization.entity').Organization;

  @ManyToOne('Category', 'jobs')
  @JoinColumn({ name: 'category_id' })
  category: import('./category.entity').Category;

  @ManyToOne('Location', 'jobs')
  @JoinColumn({ name: 'location_id' })
  location: import('./location.entity').Location | null;

  @OneToMany('Application', 'job')
  applications: import('./application.entity').Application[];

  @OneToMany('SavedJob', 'job')
  savedBy: import('./saved-job.entity').SavedJob[];

  @OneToMany('JobView', 'job')
  views: import('./job-view.entity').JobView[];

  @OneToOne('Payment', 'job')
  payment: import('./payment.entity').Payment;
}
