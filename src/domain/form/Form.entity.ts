import { Injectable } from '@nestjs/common';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { FormStatus } from '@app/domain/form/FormStatus';
import {FormType} from "@app/domain/form/FormType";

import {
  deseasesList,
  temperatureList,
  symptomsSinceList,
  symptomsList,
  coughList,
  chestPainList,
  dyspneaList
} from '@app/domain/form/covidConfig';

@Injectable()
@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  public readonly id: number | null;

  @Column()
  public readonly type: string;

  @Column({name: 'status'})
  private _status: FormStatus;

  @Column({ type: 'json', name: 'fields' })
  public readonly fields: string;

  @Column({ name: 'external_id' })
  private _externalId: string;

  @CreateDateColumn({ readonly: true, name: 'created_at' })
  public readonly createdAt: Date;

  @Column()
  @UpdateDateColumn({ name: 'updated_at' })
  public readonly updatedAt: Date;

  public set status(status: FormStatus)
  {
    this._status = status;
  }

  public get status(): FormStatus
  {
    return this._status;
  }

  public set externalId(id: string)
  {
    this._externalId = id;
  }

  public get externalId(): string | null
  {
    return this._externalId;
  }

  public constructor(type: string, fields: string, status: FormStatus) {
    this.type = type;
    this.status = status;
    this.fields = fields;
  }

  public getTableView()
  {
    if (this.type == FormType.Covid) {
        let fieldSymptoms = this.fields['symptoms'];

        fieldSymptoms = fieldSymptoms || [];
        const symptoms = Object.keys(fieldSymptoms).filter(key => this.fields['symptoms'][key] === true);


        return {
          "Для кого ищут информацию": this.fields['target'] || '',
          "Регион": this.fields['region'] || '',
          "Пол": this.fields['gender'] || '',
          "Возраст": this.fields['age'] || '',
          "Симптомы": this.translateSymptoms(symptoms, symptomsList).join(', '),
          "Тип кашля": fieldSymptoms['caughtType'] || '',
          "Тип боли в груди": fieldSymptoms['thoraxType'] || '',
          "Температура": fieldSymptoms['temperatureType'] ||  '',
          "Одышка": fieldSymptoms['dyspneaType'] || '',
          "Когда появились симптомы": fieldSymptoms['symptomsSince'] ||  '',
          "Сопутствующие заболевания": fieldSymptoms['deseases'] ? this.translateSymptoms(fieldSymptoms['deseases'], deseasesList) : '',
          "Email": this.fields['email'] || ''
        };
    }
  }


  private translateSymptoms(symptoms: string[] | string, source): string[]
  {
    let result = [];

    if (Array.isArray(symptoms)) {
      symptoms.reduce((obj, key) => {
        let symptom = source.find(item => item.id == key);
        if (symptom) {
          obj.push(symptom.value);
        }

        return obj;
      }, result);
    } else {
      console.log(symptoms);
      console.log(source);
      result = source.find(item => item.id == symptoms) || [];
      console.log(result);
    }

    return result;
  }
}
