export default interface CardManager {
  create(data?: any): any
  transfer(data?: any): any
  addLabel(data?: any): any
}

const CardManager = Symbol('CardManager')

export {
  CardManager,
}
