import { Option } from 'tsoption'

export const formatDate = (due: Option<Date>) =>
  due
    .getOrElse(new Date())
    .toLocaleString()
    .replace(/\//g, '.')
    .split(',')[0]
