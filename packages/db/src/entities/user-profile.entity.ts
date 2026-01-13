import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id', unique: true })
  userId: string;

  @Column({ type: 'varchar', name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'uuid', name: 'cv_file_id', nullable: true })
  cvFileId: string | null;

  @Column({ type: 'varchar', nullable: true })
  headline: string | null;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne('User', 'profile')
  @JoinColumn({ name: 'user_id' })
  user: import('./user.entity').User;

  @ManyToOne('File')
  @JoinColumn({ name: 'cv_file_id' })
  cvFile: import('./file.entity').File | null;
}
