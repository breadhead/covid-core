import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'

import LogicException from '../exception/LogicException'
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

    return new PaginationRequest(
      !!page ? parseInt(page, 10) : undefined,
      !!perPage ? parseInt(perPage, 10) : undefined,
    )
  }

  private supports(metadata: ArgumentMetadata) {
    return metadata.type === 'query' && metadata.metatype === PaginationRequest
  }
}
