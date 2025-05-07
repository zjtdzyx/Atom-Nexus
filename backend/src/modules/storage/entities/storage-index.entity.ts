import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StorageFile } from './storage-file.entity';
import { Did } from '../../did/entities/did.entity';

@Entity()
export class StorageIndex {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_id' })
  fileId: string;

  @ManyToOne(() => StorageFile, (file) => file.indexes)
  @JoinColumn({ name: 'file_id' })
  file: StorageFile;

  @Column({ name: 'indexer_did', nullable: true })
  indexerDid: string;

  @ManyToOne(() => Did, { nullable: true })
  @JoinColumn({ name: 'indexer_did' })
  indexer: Did;

  @Column({ type: 'jsonb' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
