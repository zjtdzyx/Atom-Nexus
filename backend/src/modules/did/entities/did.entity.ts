import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Credential } from '../../credential/entities/credential.entity';
import { DidDocument } from './did-document.entity';

@Entity()
export class Did {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  walletAddress: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  socialAccount: string;

  @Column({ type: 'text' })
  publicKey: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Credential, (credential) => credential.owner)
  credentials: Credential[];

  @OneToOne(() => DidDocument, (document) => document.did)
  document: DidDocument;
}
