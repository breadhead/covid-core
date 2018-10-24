import SmsSender from './SmsSender'

export default class FakeSmsSender implements SmsSender {
  public async send(to: string, text: string): Promise<void> {
    console.log(to, text ); // tslint:disable-line
  }
}
