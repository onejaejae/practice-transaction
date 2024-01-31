import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('session')
export class Session {
  @PrimaryColumn({ type: 'varchar', length: 255, collation: 'default' })
  sid: string;

  @Column({ type: 'jsonb' })
  sess: Record<string, any>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  expire: Date;
}
