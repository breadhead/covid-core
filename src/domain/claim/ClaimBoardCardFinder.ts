import EntityNotFoundException from '@app/domain/exception/EntityNotFoundException'
import BoardManager, {
  BoardManager as BoardManagerSymbol,
  Card,
} from '@app/infrastructure/BoardManager/BoardManager'
import Configuration from '@app/infrastructure/Configuration/Configuration'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export default class BoardCardFinder {
  public constructor(
    @Inject(BoardManagerSymbol) private readonly board: BoardManager,
    private readonly config: Configuration,
  ) {}

  public async getCardById(id: string): Promise<Card> {
    const cards = await this.board.getCardsOnBoard(
      this.config.get('BOARD_ID').getOrElse('ppy28Io5'),
    )

    const idRe = new RegExp(`${id}\\)$`)

    const claimCard = cards.find(card => idRe.test(card.desc))

    if (claimCard) {
      return claimCard
    } else {
      throw new EntityNotFoundException('Card', { id })
    }
  }

  public async getTrelloLists() {
    return this.board.getBoardLists('ppy28Io5')
  }
}
