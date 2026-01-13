import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('category_translations')
export class CategoryTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'category_id' })
  categoryId: string;

  @Column({ type: 'varchar' })
  language: string;

  @Column({ type: 'varchar' })
  name: string;

  // Relations
  @ManyToOne('Category', 'translations')
  @JoinColumn({ name: 'category_id' })
  category: import('./category.entity').Category;
}
