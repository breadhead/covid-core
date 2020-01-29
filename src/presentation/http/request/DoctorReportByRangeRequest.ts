export default class DoctorReportByRangeRequest {
  public constructor(
    public readonly from: Date,
    public readonly to: Date,
    public readonly name: string,
  ) {}
}
