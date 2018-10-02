import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { Option } from 'tsoption'

import LogicException from '../../exception/LogicException'
import PaginationRequest from './PaginationRequest'

interface PaginationQuery {
  page?: string
  perPage?: string
}

@Injectable()
export default class PaginationPipe implements PipeTransform<PaginationQuery, PaginationRequest> {
  public transform(value: PaginationQuery, metadata: ArgumentMetadata): PaginationRequest {
    if (!this.supports(metadata)) {
      throw new LogicException('Unexpected usage for PaginationPipe')
    }

    const { page, perPage } = value

    const parsedPage = Option.of(page)
      .map((_) => parseInt(_, 10))

    const parsedPerPage = Option.of(perPage)
      .map((_) => parseInt(_, 10))

    return new PaginationRequest(parsedPage, parsedPerPage)
  }

  private supports(metadata: ArgumentMetadata) {
    return metadata.type === 'query' && metadata.metatype === PaginationRequest
  }
}
