import { Option } from 'tsoption'

import LogicException from '../../../exception/LogicException'
import PaginationPipe from '../PaginationPipe'
import PaginationRequest from '../PaginationRequest'

describe('ClientController', () => {
  let pipe: PaginationPipe

  beforeAll(async () => {
    pipe = new PaginationPipe()
  })

  describe('transform', () => {
    it('should return pagination by empty query', () => {
      const query = {}

      const pagination = pipe.transform(query, {
        type: 'query',
        metatype: PaginationRequest,
      })

      expect(pagination.page).toBe(1)
      expect(pagination.perPage).toBe(10)
    })

    it('should return pagination by query', () => {
      const query = {
        page: '12',
        perPage: '150',
      }

      const pagination = pipe.transform(query, {
        type: 'query',
        metatype: PaginationRequest,
      })

      expect(pagination.page).toBe(12)
      expect(pagination.perPage).toBe(150)
    })

    it('should throw exception for illegal usage', () => {
      const body = {
        page: '12',
        perPage: '150',
      }

      expect(() =>
        pipe.transform(body, {
          type: 'body',
          metatype: PaginationRequest,
        }),
      ).toThrow(LogicException)
    })
  })
})
