export interface MessageContent {
  text?: string
  html?: string
}

export default interface EmailSender {
  send(
    from: string,
    to: string,
    subject: string,
    content: MessageContent,
  ): Promise<void>
}

const EmailSender = Symbol('EmailSender')

export { EmailSender }
