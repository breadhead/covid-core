import { Test, TestingModule } from '@nestjs/testing'

import ClaimController from '../ClaimController'

describe('ClaimController', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ClaimController],
    }).compile()
  })

  describe('showCommon', () => {
    it('should return claim with id provided in query', () => {
      const claimController = app.get<ClaimController>(ClaimController)

      const response = claimController.showCommon('12')
      expect(response.id).toBe('12')
    })
  })
})
