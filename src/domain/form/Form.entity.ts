import { Injectable } from '@nestjs/common';
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { FormStatus } from '@app/domain/form/FormStatus';
import {FormType} from "@app/domain/form/FormType";

import {
  targetList,
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
  @PrimaryColumn()
  public readonly id: string;

  @Column()
  public readonly type: string;

  @Column({name: 'status'})
  private _status: FormStatus;

  @Column({ type: 'json', name: 'fields' })
  public readonly fields: string;

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

  public constructor(type: string, fields: string, status: FormStatus) {
    this.type = type;
    this.status = status;
    this.fields = fields;
  }

  public getTableView()
  {
    console.log('ss');
    console.log(this.type);
    if (this.type == FormType.Covid) {
        this.fields['symptoms'] = this.fields['symptoms'] || [];
        const symptoms = Object.keys(this.fields['symptoms']).filter(key => this.fields['symptoms'][key] === true);

        let tbleFields = {
          "Для кого ищут информацию": this.fields['target'] || '',
          "Регион": this.fields['region'] || '',
          "Пол": this.fields['[gender'] || '',
          "Возраст": this.fields['age'] || '',
          "Симптомы": this.translateSymptoms(symptoms, symptomsList).join(', '),
          "Тип кашля": this.fields['coughOptions'] ? this.translateSymptoms(this.fields['coughOptions'], coughList) : '',
          "Тип боли в груди": this.fields['chestPainOptions'] ? this.translateSymptoms(this.fields['chestPainOptions'], chestPainList) : '',
          "Температура": this.fields['temperatureOptions'] ? this.translateSymptoms(this.fields['temperatureOptions'], temperatureList) : '',
        };

        return tbleFields;

    }
  }


  private translateSymptoms(symptoms: string[], source): string[]
  {
    let result = [];

    symptoms.reduce((obj, key) => {
      let symptom = source.find(item => item.id == key);

      obj.push(symptom.value);

      return obj;
    }, result);

    return result;
  }

  private translateSymptom(symptom: string, source): string
  {
    return source.find(item => item.id == symptom) || null;
  }
}
