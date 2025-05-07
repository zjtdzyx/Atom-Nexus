import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdminLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adminId: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  targetId: string;

  @Column()
  timestamp: Date;
}
