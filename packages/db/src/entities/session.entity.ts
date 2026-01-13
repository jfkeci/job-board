import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string | null;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string | null;

  @Column({ name: 'device_type', nullable: true })
  deviceType: string | null;

  @Column({ name: 'last_activity_at' })
  lastActivityAt: Date;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne('User', 'sessions')
  @JoinColumn({ name: 'user_id' })
  user: import('./user.entity').User;

  @OneToOne('RefreshToken', 'session')
  refreshToken: import('./refresh-token.entity').RefreshToken;
}
