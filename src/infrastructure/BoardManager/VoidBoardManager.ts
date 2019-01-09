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
    return Promise.resolve()
  }

  public createLabel(cardId: string, labelText: string): Promise<void> {
    return Promise.resolve()
  }

  public addLabel(cardId: string, labelText: string): Promise<void> {
    return Promise.resolve()
  }

  public setDueDate(cardId: string, due: Date): Promise<void> {
    return Promise.resolve()
  }

  public addMemberToCard(cardId: string, memberId: string): Promise<void> {
    return Promise.resolve()
  }

  public getBoardMembers(boardId: string): Promise<Member[]> {
    return Promise.resolve(1 as any)
  }

  public getBoardLists(boardId: string): Promise<Label[]> {
    return Promise.resolve(1 as any)
  }
}
