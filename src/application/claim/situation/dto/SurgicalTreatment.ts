import MonthYear from './MonthYear'

export default class SurgicalTreatment {
  public constructor(
    public readonly region: string,
    public readonly surgery: string,
    public readonly when?: MonthYear,
    public readonly clinic?: string,
    public readonly doctor?: string,
  ) {}
}
