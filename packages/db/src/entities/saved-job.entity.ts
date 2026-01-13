import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('saved_jobs')
export class SavedJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'job_id' })
  jobId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne('User', 'savedJobs')
  @JoinColumn({ name: 'user_id' })
  user: import('./user.entity').User;

  @ManyToOne('Job', 'savedBy')
  @JoinColumn({ name: 'job_id' })
  job: import('./job.entity').Job;
}
