import { BaseTabeViewEnum } from './BaseTabeViewEnum'

// TODO: fix types
export default interface BaseTable {
  load(name: string, view: BaseTabeViewEnum): Promise<any>
}

const BaseTable = Symbol('BaseTable')

export { BaseTable }
