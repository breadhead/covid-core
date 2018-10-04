export default class CommandBusResult<T, E> {
  public static success(result?) {
    return new CommandBusResult(result)
  }

  public static failure(error) {
    return new CommandBusResult(undefined, error)
  }

  public constructor(
    public readonly result?: T,
    public readonly error?: E,
  ) { }
}
