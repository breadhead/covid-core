export default interface SmsSender {
  send(to: string, text: string): Promise<void>
}

const SmsSender = Symbol('SmsSender')

export { SmsSender }
