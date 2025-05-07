import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Did } from '../../did/entities/did.entity';
import { CredentialProof } from './credential-proof.entity';
import { CredentialShare } from './credential-share.entity';
import { CredentialStatus } from '../models/credential.model';

@Entity()
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_did' })
  ownerDid: string;

  @ManyToOne(() => Did, (did) => did.credentials)
  @JoinColumn({ name: 'owner_did' })
  owner: Did;

  @Column()
  credentialType: string;

  @Column({ type: 'jsonb' })
  credentialData: Record<string, any>;

  @Column({
    type: 'enum',
    enum: CredentialStatus,
    default: CredentialStatus.ACTIVE,
  })
  status: CredentialStatus;

  @CreateDateColumn()
  issuedAt: Date;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  revokedAt: Date;

  @Column({ nullable: true })
  transactionHash: string;

  @OneToOne(() => CredentialProof, (proof) => proof.credential)
  proof: CredentialProof;

  @OneToMany(() => CredentialShare, (share) => share.credential)
  shares: CredentialShare[];
}
