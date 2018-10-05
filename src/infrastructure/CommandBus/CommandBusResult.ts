export default class CommandBusResult<R = any, E = any> {
  public static success<R = any>(result?) {
    return new CommandBusResult(result)
  }

  public static failure<E = any>(error) {
    return new CommandBusResult(undefined, error)
  }

  public constructor(
    public readonly result?: R,
    public readonly error?: E,
  ) { }
}
