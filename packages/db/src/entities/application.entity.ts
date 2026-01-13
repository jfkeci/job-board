import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApplicationStatus } from '../enums';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'job_id' })
  jobId: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ name: 'cover_letter', type: 'text', nullable: true })
  coverLetter: string | null;

  @Column({ type: 'uuid', name: 'cv_file_id', nullable: true })
  cvFileId: string | null;

  @Column({ type: 'varchar', name: 'linkedin_url', nullable: true })
  linkedinUrl: string | null;

  @Column({ type: 'varchar', name: 'portfolio_url', nullable: true })
  portfolioUrl: string | null;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'varchar', name: 'tracking_token', unique: true })
  trackingToken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne('Job', 'applications')
  @JoinColumn({ name: 'job_id' })
  job: import('./job.entity').Job;

  @ManyToOne('User', 'applications')
  @JoinColumn({ name: 'user_id' })
  user: import('./user.entity').User | null;

  @ManyToOne('File')
  @JoinColumn({ name: 'cv_file_id' })
  cvFile: import('./file.entity').File | null;
}
