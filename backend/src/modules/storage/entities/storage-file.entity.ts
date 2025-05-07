import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Did } from '../../did/entities/did.entity';
import { StorageIndex } from './storage-index.entity';

@Entity()
export class StorageFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'uploader_did' })
  uploaderDid: string;

  @ManyToOne(() => Did)
  @JoinColumn({ name: 'uploader_did' })
  uploader: Did;

  @Column()
  cid: string;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => StorageIndex, index => index.file)
  indexes: StorageIndex[];
} 