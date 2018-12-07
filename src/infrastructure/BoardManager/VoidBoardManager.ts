import BoardManager, { Label, Member } from './BoardManager'

export default class VoidBoardManager implements BoardManager {
  public createCard(
    name: string,
    content: string,
    listId: string,
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }

  public moveCard(cardId: string, listId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  public createLabel(cardId: string, labelText: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  public addLabel(cardId: string, labelText: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  public setDueDate(cardId: string, due: Date): Promise<void> {
    throw new Error('Method not implemented.')
  }

  public addMemberToCard(cardId: string, memberId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  public getBoardMembers(boardId: string): Promise<Member[]> {
    throw new Error('Method not implemented.')
  }

  public getBoardLists(boardId: string): Promise<Label[]> {
    throw new Error('Method not implemented.')
  }
}
