import Monitor from './Monitor'

export default class VoidMonitor implements Monitor {
  public send(message: string, date: Date): Promise<void> {
    return Promise.resolve()
  }
}
