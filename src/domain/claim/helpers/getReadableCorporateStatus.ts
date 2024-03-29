import { CorporateStatus } from '../CorporateStatus'

export const getReadableCorporateStatus = (status: CorporateStatus): string =>
  ({
    [CorporateStatus.Empty]: '',
    [CorporateStatus.Checking]: 'Проверка корпоративности',
    [CorporateStatus.Ok]: 'Корпоративность подтвеждена',
    [CorporateStatus.Fail]: 'Корпоративность не подтвеждена',
  }[status])
