import { Option } from 'tsoption'

export default (date?: string) => Option.of(date)
  .map((v) => decodeURIComponent(v))
  .map((v) => new Date(v))
