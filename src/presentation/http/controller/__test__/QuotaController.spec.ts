import { Test, TestingModule } from '@nestjs/testing'

import QuotaController from '../QuotaController'

describe('AppController', () => {
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
})
