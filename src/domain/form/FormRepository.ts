import { AbstractRepository, EntityRepository } from 'typeorm';
import { Form } from '@app/domain/form/Form.entity';

@EntityRepository(Form)
export class FormRepository extends AbstractRepository<Form> {
  public findAll() {
    return this.repository.find();
  }

  public async getOne(id: string): Promise<Form | null> {
    return this.repository.findOne(id);
  }

  public findByType(type: string): Promise<Form[]> {
    return this.repository.find({
      where: { type: type },
      order: { createdAt: 'ASC' },
    });
  }

  public findByStatus(status: string): Promise<Form[]> {
    return this.repository.find({
      where: { status: status },
      order: { createdAt: 'ASC' },
    });
  }
}
