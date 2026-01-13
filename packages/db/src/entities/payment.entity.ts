import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { JobTier, PaymentStatus, PromotionType } from '../enums';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'job_id', unique: true })
  jobId: string;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'enum', enum: JobTier })
  tier: JobTier;

  @Column('simple-array', { default: '' })
  promotions: PromotionType[];

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ name: 'provider_ref', nullable: true })
  providerRef: string | null;

  @Column({ name: 'invoice_number', unique: true, nullable: true })
  invoiceNumber: string | null;

  @Column({ name: 'paid_at', nullable: true })
  paidAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne('Organization', 'payments')
  @JoinColumn({ name: 'organization_id' })
  organization: import('./organization.entity').Organization;

  @OneToOne('Job', 'payment')
  @JoinColumn({ name: 'job_id' })
  job: import('./job.entity').Job;
}
