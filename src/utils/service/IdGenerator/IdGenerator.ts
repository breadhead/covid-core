export abstract class IdGenerator {
  abstract get(length?: number): string
  abstract getNumeric(length?: number): string
}
