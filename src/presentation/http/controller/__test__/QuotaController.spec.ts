import { Test, TestingModule } from '@nestjs/testing'

import QuotaController from '../QuotaController'

describe('QuotaController', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [QuotaController],
    }).compile()
  })

  describe('showList', () => {
    it('should return two quotas', () => {
      const quotaController = app.get<QuotaController>(QuotaController)
      expect(quotaController.showList()).toHaveLength(2)
    })
  })

  describe('transfer', () => {
    it('should return quotas with the provided ids', () => {
      const request = { sourceId: 'source', targetId: 'target', count: 12 }

      const quotaController = app.get<QuotaController>(QuotaController)

      const response = quotaController.transfer(request)
      expect(response.source.id).toBe(request.sourceId)
      expect(response.target.id).toBe(request.targetId)
    })
  })

  describe('create', () => {
    it('should return quotas with the provided name and count', () => {
      const request = { name: 'name one', count: 12 }

      const quotaController = app.get<QuotaController>(QuotaController)

      const response = quotaController.create(request)
      expect(response.name).toBe(request.name)
      expect(response.count).toBe(request.count)
    })
  })

  describe('edit', () => {
    it('should return quotas with the provided id, name and count', () => {
      const request = { id: 'id', name: 'name one', count: 12 }

      const quotaController = app.get<QuotaController>(QuotaController)

      const response = quotaController.edit(request)
      expect(response.id).toBe(request.id)
      expect(response.name).toBe(request.name)
      expect(response.count).toBe(request.count)
    })
  })
})
