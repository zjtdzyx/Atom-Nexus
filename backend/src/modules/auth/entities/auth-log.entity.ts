import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AuthLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  didId: string;

  @Column({ nullable: true })
  credentialId: string;

  @Column()
  action: string;

  @Column()
  success: boolean;

  @Column({ type: 'text', nullable: true })
  details: string;

  @CreateDateColumn()
  timestamp: Date;
}
