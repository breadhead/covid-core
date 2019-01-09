import { Inject, Injectable } from '@nestjs/common'
import Trello from 'trello'
import Configuration from '../Configuration/Configuration'
import CardManager from './CardManager'

interface Trello {
  add(name: string, od: unmber): number
}

@Injectable()
export default class TrelloCardManager implements CardManager {
  private trello: Trello

  public constructor(
    @Inject(Configuration)
    private readonly config: Configuration,
  ) {
    this.trello = (new Trello(this.config.get('TRELLO_KEY'), this.config.get('TRELLO_TOKEN'))) as Trello
  }

  public create( name = null, description, due, listId}: {name ? : string,  }) {

// id*
// The ID of the card to update
// QUERY PARAMS
// name
// The new name for the card
// desc
// The new description for the card
// closed
// Whether the card should be archived (closed: true)
// idMembers
// Comma-separated list of member IDs
// idAttachmentCover
// The ID of the image attachment the card should use as its cover, or null for none
// idList
// The ID of the list the card should be in
// idLabels
// Comma-separated list of label IDs
// idBoard
// The ID of the board the card should be on
// pos
// The position of the card in its list. top, bottom, or a positive float
// due
// When the card is due, or null
// dd/mm/yyyy
// dueComplete
// Whether the due date should be marked complete
// subscribed

  return {}
}

  public transfer() {
  return {}
}

  public addLabel() {
  return {}
}

}
