import { AbstractRepository, EntityRepository } from 'typeorm';
import { Form } from '@app/domain/form/Form.entity';
import {FormStatus} from "@app/domain/form/FormStatus";
import {Injectable} from "@nestjs/common";

@Injectable()
@EntityRepository(Form)
export class FormRepository extends AbstractRepository<Form> {
  public async findAll() {
    return this.repository.find();
  }

  public async getOne(id: string): Promise<Form | null> {
    return this.repository.findOne(id);
  }

  public async findByType(type: string): Promise<Form[]> {
    return this.repository.find({
      where: { type: type },
      order: { createdAt: 'ASC' },
    });
  }

  public async findByStatus(status: FormStatus): Promise<Form[]> {
    return this.repository.find({
      where: { _status: status },
      order: { createdAt: 'ASC' },
    });
  }
}
