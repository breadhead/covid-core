import { format } from 'date-fns'

export const formatDateOrEmpty = (date?: Date) =>
  date ? format(date, 'DD-MM-YYYY') : ''
