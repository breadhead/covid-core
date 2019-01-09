export interface Member {
  readonly id: string
  readonly login: string
}

export interface List {
  readonly id: string
  readonly name: string
}

export interface Label {
  readonly id: string
  readonly text: string
}

export default interface BoardManager {
  createCard(name: string, content: string, listId: string): Promise<string>
  moveCard(cardId: string, listId: string): Promise<void>

  addLabel(cardId: string, labelText: string): Promise<void>

  setDueDate(cardId: string, due: Date): Promise<void>

  addMemberToCard(cardId: string, memberId: string): Promise<void>

  getBoardMembers(boardId: string): Promise<Member[]>
  getBoardLists(boardId: string): Promise<List[]>
}

const BoardManager  = Symbol('BoardManager')

export {
  BoardManager,
}
