import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  domain: string;

  @Column({ type: 'varchar', name: 'default_language' })
  defaultLanguage: string;

  @Column('simple-array', { name: 'supported_languages' })
  supportedLanguages: string[];

  @Column({ type: 'varchar' })
  currency: string;

  @Column({ type: 'varchar' })
  timezone: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations defined with string references to avoid circular imports
  @OneToMany('User', 'tenant')
  users: import('./user.entity').User[];

  @OneToMany('Organization', 'tenant')
  organizations: import('./organization.entity').Organization[];

  @OneToMany('Job', 'tenant')
  jobs: import('./job.entity').Job[];

  @OneToMany('Location', 'tenant')
  locations: import('./location.entity').Location[];

  @OneToMany('Category', 'tenant')
  categories: import('./category.entity').Category[];
}
