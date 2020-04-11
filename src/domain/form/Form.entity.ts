/* eslint-disable dot-notation */
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

  @Column({ name: 'response' })
  private _response: string

  public set response(val: string) {
    this._response = val
  }

  public get response(): string | null {
    return this._response
  }

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
      return this.getCovidFields()
    }
    if (this.type === FormType.Hospital) {
      return this.getHospitalFields()
    }
    if (this.type === FormType.Partner) {
      return this.getPartnerFields()
    }
    if (this.type === FormType.Volunteer) {
      return this.getVolunteerFields()
    }
    if (this.type === FormType.WebinarRegistration) {
      return this.getWebinarRegistrationFields()
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
      result = source.find(item => item.id === symptoms) || []
    }

    return result
  }

  private getCovidFields(): Object {
    // eslint-disable-next-line dot-notation
    let fieldSymptoms = this.fields['symptoms']

    fieldSymptoms = fieldSymptoms || []
    const symptoms = Object.keys(fieldSymptoms).filter(
      key => fieldSymptoms[key] === true,
    )

    return {
      'Для кого ищут информацию': this.fields['target'] || '',
      Регион: this.fields['region'] || '',
      Пол: this.fields['gender'] || '',
      Возраст: this.fields['age'] || '',
      Симптомы: this.translateSymptoms(symptoms, symptomsList).join(', '),
      'Тип кашля': fieldSymptoms.caughtType
        ? this.translateSymptoms(fieldSymptoms.caughtType, coughList).join(', ')
        : '',
      'Тип боли в груди': fieldSymptoms.thoraxType
        ? this.translateSymptoms(fieldSymptoms.thoraxType, chestPainList).join(
            ', ',
          )
        : '',
      Температура: fieldSymptoms.temperatureType || '',
      Одышка: fieldSymptoms.dyspneaType
        ? this.translateSymptoms(fieldSymptoms.dyspneaType, chestPainList).join(
            ', ',
          )
        : '',
      'Когда появились симптомы': fieldSymptoms.symptomsSince || '',
      'Сопутствующие заболевания': fieldSymptoms.deseases
        ? this.translateSymptoms(fieldSymptoms.deseases, deseasesList)
        : '',
      Email: this.fields['email'] || '',
    }
  }

  private getHospitalFields(): Object {
    return {
      Город: this.fields['city'],
      Больница: this.fields['hospital'],
      'ФИО контактного лица': this.fields['name'],
      Телефон: this.fields['phone'],
      Почта: this.fields['Email'],
      'Чего не хватает?': this.fields['what_is_needed'],
      Статус: 'Новый',
    }
  }

  private getVolunteerFields(): Object {
    return {
      Имя: this.fields['name'],
      Почта: this.fields['email'],
      Телефон: this.fields['phone'],
      Город: this.fields['city'],
      'Ссылка на соцсети (VK/FB)': this.fields['social'],
      Профессия: this.fields['profession'],
      'Чем вы готовы помочь?': this.fields['aid'],
      'Уточните вашу профессию': this.fields['otherProfession'],
      'Сколько времени в неделю вы готовы уделять проекту?': this.fields[
        'time'
      ],
    }
  }

  private getPartnerFields(): Object {
    return {
      Имя: this.fields['name'],
      'Название организации': this.fields['organisation_name'],
      Почта: this.fields['email'],
      Телефон: this.fields['phone'],
      Тема: this.fields['theme'],
      Сообщение: this.fields['message'],
      Статус: 'Новый',
    }
  }

  private getWebinarRegistrationFields(): Object {
    return {
      'Название мероприятия': this.fields['webinarName'],
      Почта: this.fields['email'],
      Имя: this.fields['name'],
      Телефон: this.fields['phone'],
    }
  }
}
