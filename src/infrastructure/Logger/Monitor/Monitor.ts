export default interface Monitor {
  send(message: string, date: Date): Promise<void>
}

const Monitor = Symbol('Monitor')

export {
  Monitor,
}
