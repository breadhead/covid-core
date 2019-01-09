import { Inject, Injectable } from '@nestjs/common'
import Trello from 'trello'
import Configuration from '../Configuration/Configuration'
import CardManager from './CardManager'

interface Trello {
  add(name: string, od: number): number
}

@Injectable()
export default class TrelloCardManager implements CardManager {
  private trello: Trello

  public constructor(
    @Inject(Configuration)
    private readonly config: Configuration,
  ) {
    this.trello = new Trello(
      this.config.get('TRELLO_KEY'),
      this.config.get('TRELLO_TOKEN'),
    ) as Trello
  }

  public create(data) {
    return {}
  }

  public transfer() {
    return {}
  }

  public addLabel() {
    return {}
  }
}
