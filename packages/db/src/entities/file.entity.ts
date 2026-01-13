import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  filename: string;

  @Column({ type: 'varchar', name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'varchar' })
  path: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
