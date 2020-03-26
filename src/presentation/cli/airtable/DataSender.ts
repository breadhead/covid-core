import {Inject, Injectable} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';

import {Configuration} from '@app/config/Configuration';
import {FormRepository} from "@app/domain/form/FormRepository";
import {FormStatus} from "@app/domain/form/FormStatus";

const Airtable = require('airtable');

@Injectable()
export class DataSender {
  constructor(
    @InjectEntityManager()
    private readonly saver,
    @InjectRepository(FormRepository)
    private readonly formRepo: FormRepository,
    @Inject(Configuration)
    private readonly config: Configuration,
  ) {}


  public async sendForms() {

    const newForms = await this.formRepo.findByStatus(FormStatus.New);

    var base =  new Airtable({
      apiKey: this.config.getOrElse('AIRTABLE_COVID_API_KEY', null),
    }).base(this.config.getOrElse('AIRTABLE_COVID_ID', null))

    for (const form of newForms) {
      form.status = FormStatus.InProgress;
    //  await this.saver.save(form);

      console.log(form.getTableView());

      throw new Error('');

      let res = await base('Анкеты с сайта').create([
        {
          "fields": {
            "Для кого ищут информацию":
              "Для близкого человека"}
        }
      ]).then((err, records) => {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log(record.getId());
        });
      });

      console.log(res);

      form.status = FormStatus.Sent;

    //  await this.saver.save(form);
    }
  }
}
