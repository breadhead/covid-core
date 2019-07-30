import EntityNotFoundException from '@app/domain/exception/EntityNotFoundException'
import BoardManager, {
  BoardKind,
  BoardManager as BoardManagerSymbol,
  Card,
} from '@app/infrastructure/BoardManager/BoardManager'
import { Inject, Injectable } from '@nestjs/common'
import { promisify } from 'util'
import { ClaimRepository } from './ClaimRepository'
import { ClaimStatus } from './Claim.entity'

@Injectable()
export default class BoardCardFinder {
  public constructor(
    @Inject(BoardManagerSymbol) private readonly board: BoardManager,
    private readonly claimRepo: ClaimRepository,
  ) {}

  public async getCardById(
    id: string,
    numberOfRetries: number = 50,
    boardKind?: BoardKind,
  ): Promise<Card> {
    debugger
    return this.getCard(async () => {
      const currentBoardKind = !!boardKind
        ? boardKind
        : await this.defineKindById(id)

      const boardId = await this.board.getBoardIdByKind(currentBoardKind)

      const cards = await this.board.getCardsOnBoard(boardId)

      const idRe = new RegExp(`${id}\\)`)

      const card = cards.find(card => idRe.test(card.desc))

      return card
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

    if (!claimCard && numberOfRetries > 0) {
      await sleep(500)
      return this.getCard(cardFinder, numberOfRetries - 1)
    }

    throw new EntityNotFoundException('Card')
  }

  private async defineKindById(claimId: string): Promise<BoardKind> {
    const claim = await this.claimRepo.getOne(claimId).catch(() => {
      return null
    })

    if (!claim) {
      return BoardKind.Current
    }

    switch (claim.status) {
      case ClaimStatus.QuestionnaireWaiting:
        return BoardKind.Waiting
      default:
        return BoardKind.Current
    }
  }
}
