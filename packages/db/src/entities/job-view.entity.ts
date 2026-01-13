import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('job_views')
export class JobView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'job_id' })
  jobId: string;

  @Column({ type: 'timestamp', name: 'viewed_at' })
  viewedAt: Date;

  // Relations
  @ManyToOne('User', 'jobViews')
  @JoinColumn({ name: 'user_id' })
  user: import('./user.entity').User;

  @ManyToOne('Job', 'views')
  @JoinColumn({ name: 'job_id' })
  job: import('./job.entity').Job;
}
