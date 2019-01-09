interface Params {
  [key: string]: string | number | Params
}

export default class EntityNotFoundException extends Error {
  public readonly parameters: Params

  public constructor(name: string, parameters: Params = {}) {
    super(`${name} with the provided parameters not found`)

    this.parameters = parameters
  }
}
