export abstract class SmsSender {
  abstract send(to: string, text: string): Promise<void>
}
