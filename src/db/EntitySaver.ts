import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

interface Saver {
  transaction<Entity>(
    runInTransaction: (saver: Saver) => Promise<Entity>,
  ): Promise<Entity>
  save<Entity>(...entities: Entity[]): Promise<Entity[]>
  remove<Entity>(entity: Entity): Promise<Entity>
}

@Injectable()
export class EntitySaver implements Saver {
  public constructor(
    @InjectEntityManager() private readonly em: EntityManager,
  ) {}

  public async transaction<Entity>(
    runInTransaction: (saver: Saver) => Promise<Entity>,
  ): Promise<Entity> {
    return this.em.transaction(runInTransaction)
  }

  public async save<Entity>(...entities: Entity[]): Promise<Entity[]> {
    return this.em.save(entities)
  }

  public async remove<Entity>(entity: Entity): Promise<Entity> {
    return this.em.remove(entity)
  }
}
