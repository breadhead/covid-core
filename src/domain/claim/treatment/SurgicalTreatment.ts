import { Column } from 'typeorm'

export default class SurgicalTreatment {
  public constructor(
    @Column({ nullable: true, type: 'varchar' }) public readonly region: string,
    @Column({ nullable: true, type: 'text' }) public readonly surgery: string,
    @Column({ nullable: true, type: 'date' }) public readonly when?: Date,
    @Column({ nullable: true, type: 'text' }) public readonly clinic?: string,
    @Column({ nullable: true, type: 'text' }) public readonly doctor?: string,
  ) {}
}
