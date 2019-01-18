import EntityNotFoundException from '@app/domain/exception/EntityNotFoundException'
import BoardManager, {
  BoardManager as BoardManagerSymbol,
  Card,
} from '@app/infrastructure/BoardManager/BoardManager'
import Configuration from '@app/infrastructure/Configuration/Configuration'
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
    numberOfRetries: number = 0,
  ): Promise<Card> {
    const cards = await this.board.getCardsOnBoard(
      this.config.get('BOARD_ID').getOrElse('ppy28Io5'),
    )

    const sleep = promisify(setTimeout)

    const idRe = new RegExp(`${id}\\)`)

    const claimCard = cards.find(card => idRe.test(card.desc))

    if (claimCard) {
      return claimCard
    } else {
      if (numberOfRetries > 0) {
        await sleep(500)
        return this.getCardById(id, numberOfRetries - 1)
      } else {
        throw new EntityNotFoundException('Card', { id })
      }
    }
  }
}
