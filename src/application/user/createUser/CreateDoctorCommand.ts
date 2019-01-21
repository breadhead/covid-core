export default class CreateDoctorCommand {
  public constructor(
    public readonly email: string,
    public readonly rawPassword: string,
    public readonly name: string,
    public readonly boardUsername: string,
    public readonly desciption?: string,
  ) {}
}
