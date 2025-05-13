import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Identity } from './identity.entity';

@Entity('identity_profiles')
export class IdentityProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  identityId: string;

  @OneToOne(() => Identity)
  @JoinColumn({ name: 'identityId' })
  identity: Identity;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'jsonb', nullable: true })
  social?: {
    twitter?: string;
    github?: string;
    telegram?: string;
    [key: string]: string | undefined;
  };

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
    [key: string]: any;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
