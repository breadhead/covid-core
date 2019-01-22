import MonthYear from './MonthYear'

export default class MedicinalTreatment {
  public constructor(
    public readonly region: string,
    public readonly when?: MonthYear,
    public readonly clinic?: string,
    public readonly doctor?: string,
    public readonly end?: MonthYear,
    public readonly cyclesCount?: string,
    public readonly schema?: string,
  ) {}
}
