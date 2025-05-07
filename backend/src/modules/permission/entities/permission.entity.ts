import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Did } from '../../did/entities/did.entity';
import { Credential } from '../../credential/entities/credential.entity';

export enum PermissionType {
  ONCE = 'once',
  LONGTERM = 'longterm',
  PARTIAL = 'partial',
}

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'did_id' })
  didId: string;

  @ManyToOne(() => Did)
  @JoinColumn({ name: 'did_id' })
  did: Did;

  @Column({ name: 'credential_id' })
  credentialId: string;

  @ManyToOne(() => Credential)
  @JoinColumn({ name: 'credential_id' })
  credential: Credential;

  @Column({
    type: 'enum',
    enum: PermissionType,
    default: PermissionType.ONCE,
  })
  permissionType: PermissionType;

  @CreateDateColumn()
  createdAt: Date;
} 