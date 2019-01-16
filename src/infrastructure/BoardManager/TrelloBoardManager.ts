import { Injectable } from '@nestjs/common'
import * as Trello from 'trello'
import Configuration from '../Configuration/Configuration'
import BoardManager, { Card, Label, List, Member } from './BoardManager'
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

  public async moveCard(cardId: string, listId: string): Promise<void> {
    const response = await this.trello
      .updateCardList(cardId, listId)
      .then(tapOrThrow)
  }

  public async addLabel(cardId: string, labelText: string): Promise<void> {
    const card = await this.getCard(cardId)
    const label = await this.createOrGetLabel(card.idBoard, labelText)
    const result = this.trello.addLabelToCard(cardId, label.id).then(tapOrThrow)
  }
  public async setDueDate(cardId: string, due: Date): Promise<void> {
    const result = await this.trello
      .addDueDateToCard(cardId, due)
      .then(tapOrThrow)
  }
  public async addMemberToCard(
    cardId: string,
    memberId: string,
  ): Promise<void> {
    const result = await this.trello
      .addMemberToCard(cardId, memberId)
      .then(tapOrThrow)
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
      .makeRequest('GET', '/1/card/' + cardId)
      .then(tapOrThrow)
    return card
  }

  public async getCardsOnBoard(listId: string): Promise<Card[]> {
    return this.trello.getCardsOnBoard(listId).then(tapOrThrow)
  }

  private async getCardId(claimId: string) {
    return
  }

  private async createOrGetLabel(
    boardId: string,
    labelText: string,
  ): Promise<any> {
    const labels = await this.trello.getLabelsForBoard(boardId).then(tapOrThrow)
    const label =
      labels.find(({ name }) => name === labelText) ||
      (await this.trello.addLabelOnBoard(boardId, labelText).then(tapOrThrow))
    return label
  }
}
