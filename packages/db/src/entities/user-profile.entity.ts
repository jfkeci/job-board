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

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ nullable: true })
  phone: string | null;

  @Column({ name: 'cv_file_id', nullable: true })
  cvFileId: string | null;

  @Column({ nullable: true })
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
