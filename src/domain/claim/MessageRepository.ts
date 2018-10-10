import { AbstractRepository, EntityRepository } from 'typeorm'

import Message from './Message.entity'

@EntityRepository(Message)
export default class MessageRepository extends AbstractRepository<Message> {
  public findByClaimId(id: string): Promise<Message[]> {
    // TODO: added filtering by claim id

    return this.repository.find()
  }
}
