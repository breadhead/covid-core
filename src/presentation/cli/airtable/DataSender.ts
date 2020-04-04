/* eslint-disable no-await-in-loop */

import { Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'

import { Configuration } from '@app/config/Configuration'
import { FormRepository } from '@app/domain/form/FormRepository'
import { FormStatus } from '@app/domain/form/FormStatus'
import { CronJob } from 'cron'
import { Form } from '@app/domain/form/Form.entity'
import { FormType } from '@app/domain/form/FormType'

const Airtable = require('airtable')

@Injectable()
export class DataSender {
  private airtableBase
  private job

  constructor(
    @InjectEntityManager()
    private readonly saver,
    @InjectRepository(FormRepository)
    private readonly formRepo: FormRepository,
    @Inject(Configuration)
    private readonly config: Configuration,
  ) {
    this.airtableBase = new Airtable({
      apiKey: this.config.getOrElse('AIRTABLE_COVID_API_KEY', null),
    }).base(this.config.getOrElse('AIRTABLE_COVID_ID', null))
  }

  public async start() {
    this.job = new CronJob(
      `0 */1 * * *`,
      async () => {
        await this.sendForms()
      },
      null,
      null,
      null,
      null,
      true,
    )

    this.job.start()
  }

  public async sendForms(): Promise<void> {
    const inProgress = await this.formRepo.findByStatus(FormStatus.InProgress)
    if (inProgress.length > 0) {
      return
    }

    const newForms = await this.formRepo.findByStatus(FormStatus.New)
    for (const form of newForms) {
      switch (form.type) {
        case FormType.Covid:
          await this.sendForm('Анкеты с сайта', form)

          break
        case FormType.Hospital:
          await this.sendForm('Для больниц', form)

          break
        case FormType.Partner:
          await this.sendForm('Стать партнером', form)

          break
        case FormType.Volunteer:
          await this.sendForm('Стать волонтером', form)

          break
        default:
      }
    }
  }

  private async sendForm(name: string, form: Form): Promise<void> {
    form.status = FormStatus.InProgress

    await this.saver.save(form)

    if (form.externalId) {
      // eslint-disable-next-line no-await-in-loop
      await this.airtableBase(name)
        .update([
          {
            id: form.externalId,
            fields: form.getTableView(),
          },
        ])
        .then(records => {
          form.externalId = records[0].getId()

          form.status = FormStatus.Sent

          return this.saver.save(form)
        })
        .catch(error => {
          form.status = FormStatus.Fail

          form.response = error.message
          console.log(error)
          // eslint-disable-next-line no-await-in-loop
          return this.saver.save(form)
        })
    } else {
      // eslint-disable-next-line no-await-in-loop
      await this.airtableBase(name)
        .create([
          {
            fields: form.getTableView(),
          },
        ])
        .then(records => {
          form.externalId = records[0].getId()

          form.status = FormStatus.Sent

          return this.saver.save(form)
        })
        .catch(error => {
          form.status = FormStatus.Fail

          form.response = error.message

          console.log(error)
          return this.saver.save(form)
        })
    }
  }
}
