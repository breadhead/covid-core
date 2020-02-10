// TODO: fix types
export default interface BaseTable {
  load(name: string): Promise<any>
}

const BaseTable = Symbol('BaseTable')

export { BaseTable }
