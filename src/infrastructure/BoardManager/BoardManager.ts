export interface Member {
  readonly id: string
  readonly username: string
}

export interface Label {
  readonly id: string
  readonly text: string
}

export interface CreateCardParams {
  desc: string
  idLabels: string[]
}

export interface Card {
  id: string
  desc: string
  name: string
  shortUrl: string
}

export interface List {
  readonly id: string
  readonly name: string
}

export default interface BoardManager {
  createCard(name: string, content: string, listId: string): Promise<string>

  createCardWithExtraParams(
    name: string,
    params: CreateCardParams,
    listId: string,
  ): Promise<string>

  moveCard(cardId: string, listId: string): Promise<void>

  addLabel(cardId: string, labelText: string): Promise<void>

  setDueDate(cardId: string, due: Date): Promise<void>

  addMemberToCard(cardId: string, username: string): Promise<void>
  getCardMembers(cardId: string): Promise<Member[]>
  removeMemberFromCard(cardId: string, username: string): Promise<void>

  getCardsOnBoard(listId: string): Promise<Card[]>

  getBoardMembers(boardId: string): Promise<Member[]>
  getBoardLists(boardId: string): Promise<List[]>

  createOrGetLabel(boardId: string, name: string): Promise<Label>

  deleteLabelFromCard(cardId: string, labelText: string): Promise<void>
}

const BoardManager = Symbol('BoardManager')

export { BoardManager }
