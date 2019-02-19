import { AbstractRepository, EntityRepository, Equal } from 'typeorm'

import Message from './Message.entity'

@EntityRepository(Message)
export default class MessageRepository extends AbstractRepository<Message> {
  public findByClaimId(id: string): Promise<Message[]> {
    return this.repository.find({
      where: { claim: id },
    })
  }

  public async findForNotification(): Promise<Message[]> {
    return this.repository.find({
      where: {
        _notificated: false,
      },
    })
  }
}
