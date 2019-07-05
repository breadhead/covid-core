import EntityNotFoundException from '@app/domain/exception/EntityNotFoundException'
import BoardManager, {
  BoardKind,
  BoardManager as BoardManagerSymbol,
  Card,
} from '@app/infrastructure/BoardManager/BoardManager'
import { Configuration } from '@app/config/Configuration'
import { Inject, Injectable } from '@nestjs/common'
import { promisify } from 'util'

@Injectable()
export default class BoardCardFinder {
  public constructor(
    @Inject(BoardManagerSymbol) private readonly board: BoardManager,
    private readonly config: Configuration,
  ) {}

  public async getCardById(
    id: string,
    numberOfRetries: number = 50,
    boardKind: BoardKind = BoardKind.Current,
  ): Promise<Card> {
    return this.getCard(async () => {
      const boardId = this.board.getBoardIdByKind(boardKind)

      const cards = await this.board.getCardsOnBoard(boardId)

      const idRe = new RegExp(`${id}\\)`)

      return cards.find(card => idRe.test(card.desc))
    }, numberOfRetries)
  }

  public async getCardByNumber(
    number: string,
    numberOfRetries: number = 50,
    boardKind: BoardKind = BoardKind.Current,
  ): Promise<Card> {
    return this.getCard(async () => {
      const boardId = this.board.getBoardIdByKind(boardKind)

      const cards = await this.board.getCardsOnBoard(boardId)

      const numberRe = new RegExp(`Заявка #${number}`)

      return cards.find(card => numberRe.test(card.name))
    }, numberOfRetries)
  }

  private async getCard(
    cardFinder: () => Promise<Card>,
    numberOfRetries: number,
  ): Promise<Card> {
    const sleep = promisify(setTimeout)

    const claimCard = await cardFinder()

    if (claimCard) {
      return claimCard
    }

    if (numberOfRetries > 0) {
      await sleep(500)
      return this.getCard(cardFinder, numberOfRetries - 1)
    }

    throw new EntityNotFoundException('Card')
  }
}
