import { Option } from 'tsoption'

export default (date?: string) => Option.of(date).map((v) => new Date(v))
