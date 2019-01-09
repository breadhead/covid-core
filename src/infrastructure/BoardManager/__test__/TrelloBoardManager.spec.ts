import * as Trello from 'trello'
import MockConfiguration from '../../../__mocks__/Configuration'
import BoardManagerException from '../BoardManagerException'
import TrelloBoardManager from '../TrelloBoardManager'

const mockCreateCard = jest.fn().mockImplementation((title: string, description: string, listId: string) => { 
  return Promise.resolve(
    listId === 'correct-test-board-id' ? {} : '',
  )
})

const mockUpdateCardList = jest.fn().mockImplementation((cardId: string, listId: string) => { 
  return Promise.resolve(
    listId === 'correct-test-board-id' ? {} : '',
  )
})

const mockAddLabelToCard = jest.fn().mockImplementation((cardId: string, labelId: string, listId: string) => { 
  return Promise.resolve(
    listId === 'correct-test-board-id' ? {} : '',
  )
})

jest.mock('trello', () => {
  class Trello {
    public constructor(trelloAppKey: string, trelloUserToken) {
      // pass
    }

    public addCard = (title: string, description: string, listId: string) => {
      return mockCreateCard(title, description, listId)
    }
  }
  return Trello
})

describe('TrelloBoardManager', () => {

  let trelloBoardManager: TrelloBoardManager

  beforeAll(() => {
    trelloBoardManager = new TrelloBoardManager(new MockConfiguration({}) as any)
  })

  describe('createCard', () => {
    test('api method executed with correct params', async () => {
      await trelloBoardManager.createCard('test-name', 'test-content', 'correct-test-board-id')
      expect(mockCreateCard).toHaveBeenCalledTimes(1)
    })

    test('api method executed with incorrect params', async () => {
      await expect( trelloBoardManager.createCard('test-name', 'test-content', 'incorrect-test-board-id'))
        .rejects
        .toThrow(BoardManagerException)
    })
  })

  describe('moveCard', () => {
    test('api method executed with correct params', async () => {
      await trelloBoardManager.createCard('test-name', 'test-content', 'correct-test-board-id')
      expect(mockCreateCard).toHaveBeenCalledTimes(3)
    })

    test('api method executed with incorrect params', async () => {
      await expect( trelloBoardManager.createCard('test-name', 'test-content', 'incorrect-test-board-id'))
        .rejects
        .toThrow(BoardManagerException)
    })
  })

})
