export default interface Event<Payload = any> {
  readonly name: string
  readonly payload: Payload
}
