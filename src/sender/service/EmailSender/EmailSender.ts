import { MessageContent } from './MessageContent'

export abstract class EmailSender {
  abstract send(
    from: string,
    to: string,
    subject: string,
    content: MessageContent,
  ): Promise<void>
}
