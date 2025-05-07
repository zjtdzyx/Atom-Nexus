import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Credential } from '../../credential/entities/credential.entity';

@Entity()
export class Did {
  @PrimaryGeneratedColumn('uuid')
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
}
