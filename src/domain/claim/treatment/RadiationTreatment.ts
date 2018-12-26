import { Column } from 'typeorm'

export default class RadiationTreatment {
  public constructor(
    @Column('text') public readonly region: string,
    @Column('date') public readonly end: Date,
    @Column({ nullable: true, type: 'date' }) public readonly when?: Date,
    @Column({ nullable: true, type: 'text' }) public readonly clinic?: string,
    @Column({ nullable: true, type: 'text' }) public readonly doctor?: string,
    @Column({ nullable: true, type: 'int' })
    public readonly cyclesCount?: number,
    @Column({ nullable: true, type: 'text' }) public readonly schema?: string,
  ) {}
}
