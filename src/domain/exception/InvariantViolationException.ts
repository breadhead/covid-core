export default class InvariantViolationException extends Error {
  public readonly invariant: string

  public constructor(entity: string, invariant: string) {
    super(`Try to violate "${invariant}" invariant in "${entity}"`)

    this.invariant = invariant
  }
}
