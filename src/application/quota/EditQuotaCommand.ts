import { ICommand } from '@nestjs/cqrs'

export default class EditQuotaCommand implements ICommand {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly constraints: string[],
    public readonly corporate: boolean,
    public readonly companyName?: string,
    public readonly companyLogoUrl?: string,
    public readonly companyLink?: string,
    public readonly companyComment?: string,
    public readonly publicCompany?: boolean,
    public readonly comment?: string,
  ) {}
}
