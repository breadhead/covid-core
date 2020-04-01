import { Injectable } from '@nestjs/common'
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm'
import { FormStatus } from '@app/domain/form/FormStatus'
import { FormType } from '@app/domain/form/FormType'

import {
  deseasesList,
  temperatureList,
  symptomsSinceList,
  symptomsList,
  coughList,
  chestPainList,
  dyspneaList,
} from '@app/domain/form/covidConfig'

@Injectable()
@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  public readonly id: number | null

  @Column()
  public readonly type: string

  @Column({ name: 'status' })
  private _status: FormStatus

  @Column({ type: 'json', name: 'fields' })
  public readonly fields: Object

  @Column({ name: 'external_id' })
  private _externalId: string

  @CreateDateColumn({ readonly: true, name: 'created_at' })
  public readonly createdAt: Date

  @Column()
  @UpdateDateColumn({ name: 'updated_at' })
  public readonly updatedAt: Date

  public set status(status: FormStatus) {
    this._status = status
  }

  public get status(): FormStatus {
    return this._status
  }

  public set externalId(id: string) {
    this._externalId = id
  }

  public get externalId(): string | null {
    return this._externalId
  }

  public constructor(type: string, fields: string, status: FormStatus) {
    this.type = type
    this.status = status
    this.fields = fields
  }

  public getTableView(): Object | null {
    if (this.type === FormType.Covid) {
      // eslint-disable-next-line dot-notation
      let fieldSymptoms = this.fields['symptoms']

      fieldSymptoms = fieldSymptoms || []
      const symptoms = Object.keys(fieldSymptoms).filter(
        key => fieldSymptoms[key] === true,
      )

      return {
        // eslint-disable-next-line dot-notation
        'Для кого ищут информацию': this.fields['target'] || '',
        // eslint-disable-next-line dot-notation
        Регион: this.fields['region'] || '',
        // eslint-disable-next-line dot-notation
        Пол: this.fields['gender'] || '',
        // eslint-disable-next-line dot-notation
        Возраст: this.fields['age'] || '',
        Симптомы: this.translateSymptoms(symptoms, symptomsList).join(', '),
        'Тип кашля': fieldSymptoms.caughtType || '',
        'Тип боли в груди': fieldSymptoms.thoraxType || '',
        Температура: fieldSymptoms.temperatureType || '',
        Одышка: fieldSymptoms.dyspneaType || '',
        'Когда появились симптомы': fieldSymptoms.symptomsSince || '',
        'Сопутствующие заболевания': fieldSymptoms.deseases
          ? this.translateSymptoms(fieldSymptoms.deseases, deseasesList)
          : '',
        // eslint-disable-next-line dot-notation
        Email: this.fields['email'] || '',
      }
    }

    return null
  }

  private translateSymptoms(symptoms: string[] | string, source): string[] {
    let result = []

    if (Array.isArray(symptoms)) {
      symptoms.reduce((obj, key) => {
        const symptom = source.find(item => item.id === key)
        if (symptom) {
          obj.push(symptom.value)
        }

        return obj
      }, result)
    } else {
      console.log(symptoms)
      console.log(source)
      result = source.find(item => item.id === symptoms) || []
      console.log(result)
    }

    return result
  }
}
