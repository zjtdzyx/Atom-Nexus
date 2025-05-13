import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Identity } from './identity.entity';

@Entity('login_history')
export class LoginHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  identityId: string;

  @ManyToOne(() => Identity)
  @JoinColumn({ name: 'identityId' })
  identity: Identity;

  @CreateDateColumn()
  timestamp: Date;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  device?: string;

  @Column()
  success: boolean;

  @Column({ nullable: true })
  failureReason?: string;
}
