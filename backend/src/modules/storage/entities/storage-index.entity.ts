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

  @Column({ name: 'indexer_did' })
  indexerDid: string;

  @ManyToOne(() => Did)
  @JoinColumn({ name: 'indexer_did' })
  indexer: Did;

  @Column()
  indexType: string;

  @Column({ type: 'text' })
  indexData: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
