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

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column()
  language: string;

  @Column()
  name: string;

  // Relations
  @ManyToOne('Category', 'translations')
  @JoinColumn({ name: 'category_id' })
  category: import('./category.entity').Category;
}
