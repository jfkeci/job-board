import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cv_credits')
export class CvCredit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'job_id' })
  jobId: string;

  @Column()
  total: number;

  @Column({ default: 0 })
  used: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne('Organization', 'cvCredits')
  @JoinColumn({ name: 'organization_id' })
  organization: import('./organization.entity').Organization;
}
