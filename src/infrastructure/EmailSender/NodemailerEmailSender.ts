import EmailSender, { MessageContent } from './EmailSender'

export default class NodemailerEmailSender implements EmailSender {
  public async send(from: string, to: string, subject: string, content: MessageContent): Promise<void> {
    console.log(from, to, subject, content)
  }
}
