import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OrganizationSize } from '../enums';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ nullable: true })
  website: string | null;

  @Column({ name: 'logo_file_id', nullable: true })
  logoFileId: string | null;

  @Column({ nullable: true })
  industry: string | null;

  @Column({ type: 'enum', enum: OrganizationSize, nullable: true })
  size: OrganizationSize | null;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne('Tenant', 'organizations')
  @JoinColumn({ name: 'tenant_id' })
  tenant: import('./tenant.entity').Tenant;

  @ManyToOne('File')
  @JoinColumn({ name: 'logo_file_id' })
  logoFile: import('./file.entity').File | null;

  @OneToMany('User', 'organization')
  users: import('./user.entity').User[];

  @OneToMany('Job', 'organization')
  jobs: import('./job.entity').Job[];

  @OneToMany('Payment', 'organization')
  payments: import('./payment.entity').Payment[];

  @OneToMany('CvCredit', 'organization')
  cvCredits: import('./cv-credit.entity').CvCredit[];
}
