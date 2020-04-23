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
    if (this.type === FormType.Checklist) {
      return this.getChecklistFields()
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
      Должность: this.fields['position'],
      'Мобильный телефон': this.fields['phone'],
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

  private getChecklistFields(): Object {
    const shortageTitleSuffix = '(проблемы с поставкой)'
    const reservesTitleSuffix = '(сутки)'

    const shortageNameSuffix = 'ShortageExpected'
    const reservesNameSuffix = 'DaysRemaining'

    const checkListFields = {
      'Одноразовые костюмы': 'disposableSuits',
      'Одноразовые халаты': 'disposableRobes',
      Очки: 'glasses',
      'Маски обычные': 'regularMasks',
      'Респираторы FFP2': 'respiratorsFFP2',
      'Респираторы FFP3': 'respiratorsFFP3',
      'Бахилы (высокие, хирургические)': 'shoeCovers',
      'Одноразовые перчатки': 'disposableGloves',
      Антисептики: 'antiseptics',
      Видеоларингоскопы: 'videoLaryngoscopes',
      'Кислородные концентраторы': 'oxygenConcentrators',
      'Обычная носовая канюля': 'regularNasalCannula',
      'Кислородная лицевая маска с мешком (non-rebreather)': 'oxygenMask',
      'Увлажнители кислорода': 'oxygenMoisturizers',
      'Небулайзеры-компрессоры': 'nebulizersCompressors',
      'Небулайзерные насадки': 'nebulizerAttachments',
      'Рабочих аппаратов НИВЛ CPAP/BIPAP': [
        {
          name: 'workingCPAP/BIPAPCount',
          titleSuffix: '(количество аппаратов)',
        },
        {
          name: 'workingCPAP/BIPAPShortageExpected',
          titleSuffix: shortageTitleSuffix,
        },
      ],
      'Маски для аппараторв НИВЛ CPAP/BIPAP (однопатрубочных)':
        'masksForCPAP/BIPAP',
      'Рабочих аппаратов ИВЛ': [
        {
          name: 'workingVentilators',
          titleSuffix: '(количество аппаратов)',
        },
        {
          name: 'workingVentilatorsShortageExpected',
          titleSuffix: shortageTitleSuffix,
        },
      ],
      'Мешки Амбу': [
        {
          name: 'ambuBagsSwitcher',
          titleSuffix: '(свитчер: Обеспечены/Нет)',
        },
        {
          name: 'ambuBagsShortageExpected',
          titleSuffix: shortageTitleSuffix,
        },
      ],
      'Компрессоры сжатого воздуха': [
        {
          name: 'airCompressorBedsCount',
          titleSuffix: '(количество обеспеченных коек)',
        },
        {
          name: 'airCompressorShortageExpected',
          titleSuffix: shortageTitleSuffix,
        },
      ],
      'Концентраторы кислорода высокого давления': [
        {
          name: 'highPressureOxygenConcentratorsSwitcher',
          titleSuffix: '(cвитчер: Есть/Нет)',
        },
        {
          name: 'highPressureOxygenConcentratorsShortageExpected',
          titleSuffix: shortageTitleSuffix,
        },
      ],
      'Пункционнные трахеостомы': 'punctureTracheostomy',
      'Трахеостомические трубки': 'tracheostomyTube',
      'Закрытые системы для санации ТБД': 'closedTBDsystems',
      'Обычные катетеры для санации ТБД': 'TBDcatheter',
      'Одноразовые дыхательные контуры': 'disposableBreathingCircuits',
      'Вирусно-бактериальные фильтры': 'virusBacterialFilters',
      Тепловлагообменники: 'heatMoistureExchangers',
      'Уголковые коннекторы между контуром и эндотрахеальной трубкой':
        'breathingCircuitConnectors',
      'Эндотрахеальные трубки разных диаметров': 'endotrachealTubes',
      'Проводники для интубации': 'intubationStylets',
      'Гелевые подушки подлобные подгрудные для вентиляции в прон-позиции': [
        {
          name: 'heliumPillowsBedCount',
          titleSuffix: '(количество обеспеченных коек)',
        },
        {
          name: 'heliumPillowsShortageExpected',
          titleSuffix: shortageTitleSuffix,
        },
      ],
      Капельницы: 'IVBags',
      'Периферические венозные катетеры': 'peripheralVenousCatheters',
      'Центральные венозные катетеры': 'centralVenousCatheters',
      'Трехходовые краники': 'threeWayStopcocks',
      'Инфузоматы шприцевые': [
        {
          name: 'syringeInfusionPumpsBedCount',
          titleSuffix: '(количество обеспеченных коек)',
        },
        {
          name: 'syringeInfusionPumpsShortageExpected',
          titleSuffix: shortageTitleSuffix,
        },
      ],
      'Инфузоматы перистальтические': 'peristalticInfusionPumps',
      'Шприцы для инфузоматов (50 мл)': 'infusionSyringes',
      'Инфузионные линии': 'infusionLines',
      'Капельницы для инфузоматов': 'infusionBags',
      'Пульсоксиметры (портативные)': 'portablePulseOximeters',
      'Пульсоксиметры-мониторы': 'pulseOximeters',
      Капнографы: 'capnographs',
      'Простые мониторы (ниАД, ЭКГ, SpO2)': 'simpleMonitors',
      'Анализаторы газов крови': 'bloodGasAnalyzer',
      'Системы для инфузии энтерального питания': 'enteralInfusionSystems',
      'Назогастральные/дуоденальные зонды для питания': 'nasogastricTubes',
      'Инфузоматы перистальтические для энтерального питания':
        'peristalticEnteralInfusionPumps',
      Бинты: 'bandages',
      Пластыри: 'bandAids',
      Наклейки: 'stickers',
      'Катетеры Фолея': 'foleyCatheters',
      Мочеприемники: 'urineBags',
    }

    const resultFields = {
      Город: this.fields['city'],
      Больница: this.fields['hospital'],
      'ФИО контактного лица': this.fields['name'],
      Должность: this.fields['position'],
      'Мобильный телефон': this.fields['phone'],
      Почта: this.fields['Email'],
      'Чего не хватает?': this.fields['what_is_needed'],
      Статус: 'Новый',
    }

    Object.entries(checkListFields).forEach(([key, value]) => {
      if (typeof value === 'string') {
        resultFields[key + reservesTitleSuffix] = this.fields[
          value + reservesNameSuffix
        ]
        resultFields[key + shortageTitleSuffix] = this.fields[
          value + shortageNameSuffix
        ]
      } else {
        value.forEach(({ name, titleSuffix }) => {
          resultFields[key + titleSuffix] = this.fields[name]
        })
      }
    })

    return resultFields
  }
}
