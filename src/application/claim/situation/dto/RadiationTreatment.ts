import MonthYear from './MonthYear'

export default class RadiationTreatment {
  public constructor(
    public readonly region: string,
    public readonly end: MonthYear,
    public readonly when?: MonthYear,
    public readonly clinic?: string,
    public readonly doctor?: string,
    public readonly cyclesCount?: number,
    public readonly schema?: string,
  ) {}
}
