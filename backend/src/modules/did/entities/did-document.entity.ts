import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Did } from './did.entity';

@Entity()
export class DidDocument {
  @PrimaryColumn()
  id: string; // 使用与DID相同的ID

  @Column('jsonb')
  context: string[]; // @context字段

  @Column()
  controller: string;

  @Column('jsonb')
  verificationMethod: Array<{
    id: string;
    type: string;
    controller: string;
    publicKeyHex: string;
  }>;

  @Column('jsonb')
  authentication: string[];

  @OneToOne(() => Did)
  @JoinColumn({ name: 'id' })
  did: Did;
}
