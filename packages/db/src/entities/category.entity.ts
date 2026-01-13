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

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  tenantId: string | null;

  @Column({ type: 'uuid', name: 'parent_id', nullable: true })
  parentId: string | null;

  @Column({ type: 'varchar' })
  slug: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne('Tenant', 'categories')
  @JoinColumn({ name: 'tenant_id' })
  tenant: import('./tenant.entity').Tenant | null;

  @ManyToOne('Category', 'children')
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null;

  @OneToMany('Category', 'parent')
  children: Category[];

  @OneToMany('CategoryTranslation', 'category')
  translations: import('./category-translation.entity').CategoryTranslation[];

  @OneToMany('Job', 'category')
  jobs: import('./job.entity').Job[];
}
