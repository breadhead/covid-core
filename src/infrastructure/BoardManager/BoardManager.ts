export default interface BoardManager {
  addLabel(boardId: string, cardId: string, labelText: string): Promise<void>
}

const BoardManager  = Symbol('BoardManager')

export {
  BoardManager,
}
