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

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'viewed_at' })
  viewedAt: Date;

  // Relations
  @ManyToOne('User', 'jobViews')
  @JoinColumn({ name: 'user_id' })
  user: import('./user.entity').User;

  @ManyToOne('Job', 'views')
  @JoinColumn({ name: 'job_id' })
  job: import('./job.entity').Job;
}
