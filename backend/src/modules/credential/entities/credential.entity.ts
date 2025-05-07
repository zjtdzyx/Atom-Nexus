import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Did } from '../../did/entities/did.entity';

export enum CredentialStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

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

  @Column()
  issuedAt: Date;

  @Column({ nullable: true })
  revokedAt: Date;
}
