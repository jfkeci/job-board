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

import { LocationType } from '../enums';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId: string;

  @Column({ type: 'uuid', name: 'parent_id', nullable: true })
  parentId: string | null;

  @Column({ type: 'enum', enum: LocationType })
  type: LocationType;

  @Column({ type: 'varchar' })
  slug: string;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne('Tenant', 'locations')
  @JoinColumn({ name: 'tenant_id' })
  tenant: import('./tenant.entity').Tenant;

  @ManyToOne('Location', 'children')
  @JoinColumn({ name: 'parent_id' })
  parent: Location | null;

  @OneToMany('Location', 'parent')
  children: Location[];

  @OneToMany('Job', 'location')
  jobs: import('./job.entity').Job[];
}
