import { format } from 'date-fns'

import Claim from '@app/domain/claim/Claim.entity'
import { Role } from '@app/user/model/Role'
import { defineStatus } from './ClaimForListResponse'

const formatDateOrEmpty = (date?: Date) =>
  date ? format(date, 'DD-MM-YYYY') : ''

const tryOr = <T>(get: () => T, or: T) => {
  try {
    return get()
  } catch (e) {
    return or
  }
}

const getReadbleRole = (role: Role): string =>
  ({
    [Role.Client]: 'Заказчик',
    [Role.Doctor]: 'Эксперт',
    [Role.CaseManager]: 'Кейс-менеджер',
    [Role.Admin]: 'Администратор',
  }[role])

export class ClaimStatisticsItem {
  public static fromClaim(siteUrl: string) {
    const createLink = id => `${siteUrl}/consultation/redirect/${id}`

    return (claim: Claim): ClaimStatisticsItem => ({
      number: claim.number.toString(),
      theme: claim.theme,
      createdAt: formatDateOrEmpty(claim.createdAt),
      sentToDoctorAt: formatDateOrEmpty(claim.sentToDoctorAt),
      sentToClientAt: formatDateOrEmpty(claim.sentToClientAt),
      closedAt: formatDateOrEmpty(claim.closedAt),
      name: claim.applicant.name,
      phone: tryOr(() => claim.author.contacts.phone, ''),
      email: tryOr(() => claim.author.contacts.email, ''),
      doctor: tryOr(() => claim.doctor.fullName, ''),
      localization: claim.localization || '',
      forWho: claim.target,
      age: claim.applicant.age.toString(),
      gender: claim.applicant.gender,
      region: claim.applicant.region,
      quota: tryOr(() => claim.quota.name, ''),
      closedWith: claim.isInactive() ? defineStatus(claim.status) : '',
      closedBy: tryOr(() => getReadbleRole(claim.closedBy), ''),
      link: createLink(claim.id),
      donator: tryOr(() => claim.quota.company.name, ''),
    })
  }

  public static getHeader(): ClaimStatisticsItem {
    return {
      number: 'Заявка',
      theme: 'Тема вопроса',
      createdAt: 'Дата создания',
      sentToDoctorAt: 'Дата передачи эксперту',
      sentToClientAt: 'Дата передачи клиенту',
      closedAt: 'Дата закрытия',
      name: 'Имя',
      phone: 'Телефон',
      email: 'Почта',
      doctor: 'Эксперт',
      localization: 'Локализация',
      forWho: 'Для кого консультация',
      age: 'Возраст',
      gender: 'Пол',
      region: 'Регион',
      quota: 'Тип квоты',
      closedWith: 'Закрыта со статусом',
      closedBy: 'Кто закрыл',
      link: 'Ссылка на сервис',
      donator: 'Жертвователь',
    }
  }

  public readonly number: string
  public readonly theme: string
  public readonly createdAt: string
  public readonly sentToDoctorAt: string
  public readonly sentToClientAt: string
  public readonly closedAt: string
  public readonly name: string
  public readonly phone: string
  public readonly email: string
  public readonly doctor: string
  public readonly localization: string
  public readonly forWho: string
  public readonly age: string
  public readonly gender: string
  public readonly region: string
  public readonly quota: string
  public readonly closedWith: string
  public readonly closedBy: string
  public readonly link: string
  public readonly donator: string
}
