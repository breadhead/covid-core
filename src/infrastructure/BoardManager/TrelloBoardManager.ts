import { Injectable } from '@nestjs/common'
import * as Trello from 'trello'
import { Configuration } from '../../config/Configuration'
import BoardManager, {
  BoardKind,
  Card,
  CreateCardParams,
  Label,
  List,
  Member,
} from './BoardManager'
import BoardManagerException from './BoardManagerException'

const tapOrThrow = response => {
  if (typeof response === 'string') {
    throw new BoardManagerException(response)
  }
  return response
}

@Injectable()
export default class TrelloBoardManager implements BoardManager {
  private trello: any

  public constructor(private readonly config: Configuration) {
    this.trello = new Trello(
      this.config
        .get('TRELLO_APP_KEY')
        .getOrElse('f3e15111456e6b40e7276b58c3ac5a33'),
      this.config
        .get('TRELLO_USER_TOKEN')
        .getOrElse(
          '6d7cfc89e7d946b852fc749fd996493482cb17ea895c6c086e6a586657168001',
        ),
    )
  }

  public async createCard(
    name: string,
    content: string,
    listId: string,
  ): Promise<string> {
    const response = await this.trello
      .addCard(name, content, listId)
      .then(tapOrThrow)
    return response.id
  }

  public async createCardWithExtraParams(
    name: string,
    params: CreateCardParams,
    listId: string,
  ): Promise<string> {
    const response = await this.trello
      .addCardWithExtraParams(name, params, listId)
      .then(tapOrThrow)
    return response.id
  }

  public async moveCard(
    cardId: string,
    listId: string,
    boardId?: string,
  ): Promise<void> {
    if (boardId) {
      await this.trello
        .makeRequest('put', `/1/cards/${cardId}`, {
          idList: listId,
          idBoard: boardId,
        })
        .then(tapOrThrow)
    } else {
      await this.trello.updateCardList(cardId, listId).then(tapOrThrow)
    }
  }

  public async addLabel(cardId: string, labelText: string): Promise<void> {
    try {
      const card = await this.getCard(cardId)
      const label = await this.createOrGetLabel(card.idBoard, labelText)
      await this.trello.addLabelToCard(cardId, label.id).then(tapOrThrow)
    } catch (e) {
      // pass
      // ok, we can't assign label
      // never mind
    }
  }

  public async deleteLabelFromCard(
    cardId: string,
    labelText: string,
  ): Promise<void> {
    const card = await this.getCard(cardId)
    const label = await this.createOrGetLabel(card.idBoard, labelText)
    return this.trello.deleteLabelFromCard(cardId, label.id)
  }

  public async setDueDate(cardId: string, due: Date | null): Promise<void> {
    const result = await this.trello
      .addDueDateToCard(cardId, due)
      .then(tapOrThrow)
  }
  public async addMemberToCard(
    cardId: string,
    username: string,
  ): Promise<void> {
    const card = await this.getCard(cardId)
    const member = await this.getBoardMemberByUsername(card.idBoard, username)

    return this.trello.addMemberToCard(cardId, member.id).then(tapOrThrow)
  }

  public async removeMemberFromCardByUsername(
    cardId: string,
    username: string,
  ): Promise<void> {
    const card = await this.getCard(cardId)
    const member = await this.getBoardMemberByUsername(card.idBoard, username)

    return this.removeMemberFromCard(cardId, member.id)
  }

  public async removeMemberFromCard(
    cardId: string,
    userId: string,
  ): Promise<void> {
    return this.trello.makeRequest(
      'delete',
      `/1/cards/${cardId}/idMembers/${userId}`,
    )
  }

  public async removeAllMembersFromCard(cardId: string): Promise<void> {
    const members = await this.getCardMembers(cardId)

    await Promise.all(
      members.map(member => this.removeMemberFromCard(cardId, member.id)),
    )
  }

  public async getCardMembers(cardId: string): Promise<Member[]> {
    return this.trello.makeRequest('get', `/1/cards/${cardId}/members`)
  }

  public async getBoardMembers(boardId: string): Promise<Member[]> {
    const result = await this.trello.getBoardMembers(boardId).then(tapOrThrow)
    return result
  }
  // TODO: fix types
  public async getBoardLists(boardId: string): Promise<List[]> {
    const result = await this.trello.getListsOnBoard(boardId).then(tapOrThrow)
    return result
  }

  public async getCard(cardId: string) {
    const card = this.trello
      .makeRequest('GET', `/1/card/${cardId}`)
      .then(tapOrThrow)
    return card
  }

  public async getCardsOnBoard(listId: string): Promise<Card[]> {
    return this.trello.getCardsOnBoard(listId).then(tapOrThrow)
  }

  public async createOrGetLabel(
    boardId: string,
    labelText: string,
  ): Promise<any> {
    const labels = await this.getLabelsForBoard(boardId).then(tapOrThrow)

    return (
      labels.find(({ name }) => name === labelText) ||
      this.trello.addLabelOnBoard(boardId, labelText).then(tapOrThrow)
    )
  }

  public getBoardIdByKind(boardKind: BoardKind): string {
    const boardIdCurrent = this.config
      .get('BOARD_ID_CURRENT')
      .getOrElse('5baa59a6648f9b2166d65935')

    const boardIdRejected = this.config
      .get('BOARD_ID_REJECTED')
      .getOrElse('5baa59a6648f9b2166d65935')

    const boardIdCompleted = this.config
      .get('BOARD_ID_COMPLETED')
      .getOrElse('5baa59a6648f9b2166d65935')

    const boardIdWaiting = this.config
      .get('BOARD_ID_WAITING')
      .getOrElse('5baa59a6648f9b2166d65935')

    return {
      [BoardKind.Current]: boardIdCurrent,
      [BoardKind.Rejected]: boardIdRejected,
      [BoardKind.Completed]: boardIdCompleted,
      [BoardKind.Waiting]: boardIdWaiting,
    }[boardKind]
  }

  private async getLabelsForBoard(boardId: string) {
    return this.trello.makeRequest('GET', `/1/boards/${boardId}/labels`, {
      limit: 0,
    })
  }

  private async getBoardMemberByUsername(boardId: string, username: string) {
    const boardMembers = await this.getBoardMembers(boardId)
    return boardMembers.find(member => member.username === username)
  }
}
