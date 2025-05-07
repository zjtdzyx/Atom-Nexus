import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Did } from '../../did/entities/did.entity';

@Entity()
export class SecurityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'did_id', nullable: true })
  didId: string;

  @ManyToOne(() => Did, { nullable: true })
  @JoinColumn({ name: 'did_id' })
  did: Did;

  @Column()
  eventType: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'text' })
  eventData: string;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ nullable: true })
  severity: string;

  @CreateDateColumn()
  timestamp: Date;
}
