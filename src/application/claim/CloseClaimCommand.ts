import { ICommand } from '@nestjs/cqrs'

export enum CloseType {
  Successful = 'successful',
  Unsuccessful = 'unsuccessful',
  Refuse = 'refuse',
  NoContact = 'no-contact',
  NoAnswerNeeded = 'no-answer-needed',
  WithoutNotification = 'without-notification',
}

export default class CloseClaimCommand implements ICommand {
  public constructor(
    public readonly id: string,
    public readonly type: CloseType,
    public readonly deallocateQuota: boolean,
    public readonly comment: string,
    public readonly closedBy: string[],
  ) {}
}
