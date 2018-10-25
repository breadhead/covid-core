import BoardManager from './BoardManager'

export default class VoidBoardManager implements BoardManager {
  public async addLabel(boardId: string, cardId: string, labelText: string): Promise<void> {
    console.log('LABEL ADDED', boardId, cardId, labelText) // tslint:disable-line
  }
}
