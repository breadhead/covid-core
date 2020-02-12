import { BaseTabeViewEnum } from './BaseTabeViewEnum'

export default interface BaseTable {
  load(name: string, view: BaseTabeViewEnum): Promise<any>
  update(authHeader: string): Promise<string>
}

const BaseTable = Symbol('BaseTable')

export { BaseTable }
