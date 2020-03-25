import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { FormStatus } from '@app/domain/form/FormStatus';

@Entity()
export class Form {
  @PrimaryColumn()
  public readonly id: string;

  @Column()
  public readonly type: string;

  @Column()
  public readonly status: FormStatus;

  @Column({ type: 'json', name: 'fields' })
  public readonly fields: string;

  @CreateDateColumn({ readonly: true, name: 'created_at' })
  public readonly createdAt: Date;

  @Column()
  @UpdateDateColumn({ name: 'updated_at' })
  public readonly updatedAt: Date;

  public constructor(type: string, fields: string, status: FormStatus) {
    this.type = type;
    this.status = status;
    this.fields = fields;
  }
}
