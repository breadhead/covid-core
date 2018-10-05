export default interface IdGenerator {
  get(length?: number): string
}

const IdGenerator = Symbol('IdGenerator')

export {
  IdGenerator,
}
