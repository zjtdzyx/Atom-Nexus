import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Credential } from './credential.entity';

@Entity()
export class CredentialShare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'credential_id' })
  credentialId: string;

  @ManyToOne(() => Credential)
  @JoinColumn({ name: 'credential_id' })
  credential: Credential;

  @Column()
  shareUrl: string;

  @Column({ type: 'text', nullable: true })
  qrCodeData: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;
}
