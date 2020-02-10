// TODO: fix types
export default interface BaseTable {
  load(): Promise<any>
}

const BaseTable = Symbol('BaseTable')

export { BaseTable }
