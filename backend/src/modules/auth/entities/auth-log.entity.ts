import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Did } from '../../did/entities/did.entity';
import { Credential } from '../../credential/entities/credential.entity';

@Entity()
export class AuthLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'did_id' })
  didId: string;

  @ManyToOne(() => Did)
  @JoinColumn({ name: 'did_id' })
  did: Did;

  @Column({ name: 'credential_id', nullable: true })
  credentialId: string;

  @ManyToOne(() => Credential, { nullable: true })
  @JoinColumn({ name: 'credential_id' })
  credential: Credential;

  @Column()
  action: string;

  @Column()
  success: boolean;

  @Column()
  timestamp: Date;
}
