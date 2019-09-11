import { Role } from '@app/user/model/Role'

export const getReadbleRole = (role: Role): string =>
  ({
    [Role.Client]: 'Заказчик',
    [Role.Doctor]: 'Эксперт',
    [Role.CaseManager]: 'Кейс-менеджер',
    [Role.Admin]: 'Администратор',
  }[role])
