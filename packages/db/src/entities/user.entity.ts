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

import { UserRole } from '../enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ default: 'en' })
  language: string;

  @Column({ name: 'organization_id', nullable: true })
  organizationId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne('Tenant', 'users')
  @JoinColumn({ name: 'tenant_id' })
  tenant: import('./tenant.entity').Tenant;

  @ManyToOne('Organization', 'users')
  @JoinColumn({ name: 'organization_id' })
  organization: import('./organization.entity').Organization | null;

  @OneToOne('UserProfile', 'user')
  profile: import('./user-profile.entity').UserProfile;

  @OneToMany('Session', 'user')
  sessions: import('./session.entity').Session[];

  @OneToMany('Application', 'user')
  applications: import('./application.entity').Application[];

  @OneToMany('SavedJob', 'user')
  savedJobs: import('./saved-job.entity').SavedJob[];

  @OneToMany('JobView', 'user')
  jobViews: import('./job-view.entity').JobView[];
}
