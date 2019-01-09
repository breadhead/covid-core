import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { Option } from 'tsoption'

import LogicException from '../../exception/LogicException'
import PaginationRequest from './PaginationRequest'

interface PaginationQuery {
  page?: string
  perPage?: string
}

@Injectable()
export default class PaginationPipe
  implements PipeTransform<PaginationQuery, PaginationRequest> {
  public transform(
    value: PaginationQuery,
    metadata: ArgumentMetadata,
  ): PaginationRequest {
    if (!this.supports(metadata)) {
      throw new LogicException('Unexpected usage for PaginationPipe')
    }

    const { page, perPage } = value

    const parsedPage = Option.of(page).map(parseInt)
    const parsedPerPage = Option.of(perPage).map(parseInt)

    return new PaginationRequest(parsedPage, parsedPerPage)
  }

  private supports(metadata: ArgumentMetadata) {
    return metadata.type === 'query' && metadata.metatype === PaginationRequest
  }
}
