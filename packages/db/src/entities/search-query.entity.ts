import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('search_queries')
export class SearchQuery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', name: 'session_id', nullable: true })
  sessionId: string | null;

  @Column({ type: 'varchar', name: 'query_text', nullable: true })
  queryText: string | null;

  @Column({ type: 'uuid', name: 'category_id', nullable: true })
  categoryId: string | null;

  @Column({ type: 'uuid', name: 'location_id', nullable: true })
  locationId: string | null;

  @Column({ type: 'varchar', name: 'employment_type', nullable: true })
  employmentType: string | null;

  @Column({ type: 'varchar', name: 'remote_option', nullable: true })
  remoteOption: string | null;

  @Column({ type: 'varchar', name: 'experience_level', nullable: true })
  experienceLevel: string | null;

  @Column({ type: 'int', name: 'salary_min', nullable: true })
  salaryMin: number | null;

  @Column({ type: 'int', name: 'salary_max', nullable: true })
  salaryMax: number | null;

  @Column({ type: 'int', name: 'result_count', default: 0 })
  resultCount: number;

  @Column({ type: 'varchar', name: 'ip_address', nullable: true })
  ipAddress: string | null;

  @Column({ type: 'varchar', name: 'user_agent', nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne('Tenant', 'searchQueries')
  @JoinColumn({ name: 'tenant_id' })
  tenant: import('./tenant.entity').Tenant;

  @ManyToOne('User', 'searchQueries')
  @JoinColumn({ name: 'user_id' })
  user: import('./user.entity').User | null;

  @ManyToOne('Category')
  @JoinColumn({ name: 'category_id' })
  category: import('./category.entity').Category | null;

  @ManyToOne('Location')
  @JoinColumn({ name: 'location_id' })
  location: import('./location.entity').Location | null;
}
