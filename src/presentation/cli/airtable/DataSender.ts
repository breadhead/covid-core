import {Inject, Injectable} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';

import {Configuration} from '@app/config/Configuration';
import {FormRepository} from "@app/domain/form/FormRepository";
import {FormStatus} from "@app/domain/form/FormStatus";
import {CronJob} from "cron";

const Airtable = require('airtable');

@Injectable()
export class DataSender {
  private airtableBase;
  private job;

  constructor(
    @InjectEntityManager()
    private readonly saver,
    @InjectRepository(FormRepository)
    private readonly formRepo: FormRepository,
    @Inject(Configuration)
    private readonly config: Configuration,
  ) {
    this.airtableBase =  new Airtable({
      apiKey: this.config.getOrElse('AIRTABLE_COVID_API_KEY', null),
    }).base(this.config.getOrElse('AIRTABLE_COVID_ID', null))
  }

  public async start() {
    this.job = new CronJob(
      `0 */1 * * *`,
      async () => {
        await this.sendForms();
      },
      null,
      null,
      null,
      null,
      true,
    );

    this.job.start();
  }

  public async sendForms() {
    const inProgress = await this.formRepo.findByStatus(FormStatus.InProgress);
    if (inProgress.length > 0) {
      return false;
    }

    const newForms = await this.formRepo.findByStatus(FormStatus.New);

    for (const form of newForms) {
      form.status = FormStatus.InProgress;
      await this.saver.save(form);

      if (form.externalId) {
        await this.airtableBase('Анкеты с сайта').update(
          [{
            "id": form.externalId,
            "fields": form.getTableView()
          }])
          .then(records => {
            form.externalId = records[0].getId();

            form.status = FormStatus.Sent;

            return this.saver.save(form);
          })
          .catch(error => {
            form.status = FormStatus.Fail;

            return this.saver.save(form);
          });
      } else {
        await this.airtableBase('Анкеты с сайта')
          .create(
            [{
              "fields": form.getTableView()
            }])
          .then(records => {
            form.externalId = records[0].getId();

            form.status = FormStatus.Sent;

            return this.saver.save(form);
          })
          .catch(error => {
            form.status = FormStatus.Fail;

            return this.saver.save(form);
          });
      }
    }
  }
}
