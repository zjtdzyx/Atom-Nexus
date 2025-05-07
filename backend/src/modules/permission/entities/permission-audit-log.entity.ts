import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Did } from '../../did/entities/did.entity';

@Entity()
export class PermissionAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'did_id' })
  didId: string;

  @ManyToOne(() => Did)
  @JoinColumn({ name: 'did_id' })
  did: Did;

  @Column()
  action: string;

  @Column()
  timestamp: Date;
}
