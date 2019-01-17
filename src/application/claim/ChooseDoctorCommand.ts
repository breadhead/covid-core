import { ICommand } from '@nestjs/cqrs'

export default class ChooseDoctorCommand implements ICommand {
  public constructor(
    public readonly claimId: string,
    public readonly doctorLogin: string,
  ) {}
}
