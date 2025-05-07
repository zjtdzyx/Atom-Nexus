import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Credential } from './credential.entity';

@Entity()
export class CredentialProof {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'credential_id' })
  credentialId: string;

  @OneToOne(() => Credential)
  @JoinColumn({ name: 'credential_id' })
  credential: Credential;

  @Column()
  type: string;

  @CreateDateColumn()
  created: Date;

  @Column()
  verificationMethod: string;

  @Column()
  proofPurpose: string;

  @Column({ type: 'text' })
  signatureValue: string;
}
