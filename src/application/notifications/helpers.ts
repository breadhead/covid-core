import { format } from 'date-fns'
import { Option } from 'tsoption'

export const formatDate = (due: Option<Date>) =>
  format(due.getOrElse(new Date()), 'DD.MM.YYYY')

export const SHORTENING_SERVICE = 'https://clck.ru/--?url='
