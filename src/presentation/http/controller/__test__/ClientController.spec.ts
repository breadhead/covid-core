import { Test, TestingModule } from '@nestjs/testing'

import PaginationRequest from '../../request/pagination/PaginationRequest'
import ClientController from '../ClientController'

describe('ClientController', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ClientController],
    }).compile()
  })

  describe('showList', () => {
    it('should return page and perPage according to request', () => {
      const clientController = app.get<ClientController>(ClientController)
      const pagination = new PaginationRequest(2, 13)

      const response = clientController.showList(pagination)
      expect(response.page).toBe(pagination.page)
      expect(response.perPage).toBe(pagination.perPage)
    })

    it('should return less than or equal to perPage ', () => {
      const clientController = app.get<ClientController>(ClientController)
      const pagination = new PaginationRequest(2, 13)

      const response = clientController.showList(pagination)
      expect(response.items.length).toBeLessThanOrEqual(pagination.perPage)
    })
  })

  describe('register', () => {
    it('should return email and phone according to request', () => {
      const clientController = app.get<ClientController>(ClientController)
      const registration = { email: 'email@email.com' }

      const response = clientController.register(registration)
      expect(response.email).toBe(registration.email)
      expect(response.phone).toBe(undefined)
    })
  })

  describe('login', () => {
    it('should return token with 3 segments', () => {
      const clientController = app.get<ClientController>(ClientController)
      const creds = { login: 'email@email.com', password: 'pass' }

      const response = clientController.login(creds)
      expect(response.token.split('.')).toHaveLength(3)
    })
  })
})
