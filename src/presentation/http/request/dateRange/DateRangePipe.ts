import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { flow } from 'lodash'
import { Option } from 'tsoption'

import { endOfTheDay, previusMonth, startOfTheDay } from '@app/infrastructure/utils/date'

import LogicException from '../../exception/LogicException'
import DateRangeRequest from './DateRangeRequest'
import normalizeDate from './utils/normalizeDate'

interface DateRangeQuery {
  from?: string
  to?: string
}

const DEFAULT_FROM: Date = previusMonth(new Date())
const DEFAULT_TO = new Date()

@Injectable()
export default class DateRandePipe implements PipeTransform<DateRangeQuery, DateRangeRequest> {
  public transform(value: DateRangeQuery, metadata: ArgumentMetadata): DateRangeRequest {
    if (!this.supports(metadata)) {
      throw new LogicException('Unexpected usage for DateRandePipe')
    }

    const { from, to } = value

    const parsedFrom: Date = flow([
      (this.toDate),
      normalizeDate(DEFAULT_FROM),
      startOfTheDay,
    ])(from)

    const parsedTo: Date = flow([
      this.toDate,
      normalizeDate(DEFAULT_TO),
      endOfTheDay,
    ])(to)

    return new DateRangeRequest(parsedFrom, parsedTo)
  }

  private supports(metadata: ArgumentMetadata) {
    return metadata.type === 'query' && metadata.metatype === DateRangeRequest
  }

  private toDate(date?: string): Option<Date> {
    return Option.of(date).map((v) => new Date(v))
  }
}
