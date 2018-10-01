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
})
