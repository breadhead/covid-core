import BoardManager, {
  Card,
  CreateCardParams,
  Label,
  List,
  Member,
} from './BoardManager'

export default class VoidBoardManager implements BoardManager {
  public createCard(
    name: string,
    content: string,
    listId: string,
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }

  public createCardWithExtraParams(
    name: string,
    params: CreateCardParams,
    listId: string,
  ): Promise<string> {
    return Promise.resolve('')
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

  public deleteLabelFromCard(cardId: string, labelText: string): Promise<void> {
    return Promise.resolve()
  }

  public setDueDate(cardId: string, due: Date): Promise<void> {
    return Promise.resolve()
  }

  public addMemberToCard(cardId: string, username: string): Promise<void> {
    return Promise.resolve()
  }

  public getCardMembers(cardId: string): Promise<Member[]> {
    return Promise.resolve([])
  }

  public removeMemberFromCardByUsername(
    cardId: string,
    username: string,
  ): Promise<void> {
    return Promise.resolve()
  }

  public removeMemberFromCard(cardId: string, userId: string): Promise<void> {
    return Promise.resolve()
  }

  public removeAllMembersFromCard(cardId: string): Promise<void> {
    return Promise.resolve()
  }

  public getCardsOnBoard(boardId: string): Promise<Card[]> {
    return Promise.resolve([])
  }

  public getBoardMembers(boardId: string): Promise<Member[]> {
    return Promise.resolve(1 as any)
  }

  public getBoardLists(boardId: string): Promise<List[]> {
    return Promise.resolve(1 as any)
  }

  public createOrGetLabel(boardId: string, name: string): Promise<Label> {
    return Promise.resolve(1 as any)
  }
}
