import { formatTimestamp } from '@app/utils/service/formatTimestamp'

interface DoctorStat {
  name: any
  average: any
  median: any
  min: any
  max: any
  all: any
  success: any
  failure: any
  closedByClient: any
  ratingAverage: any
  ratingMedian: any
}

export class DoctorStatisticsItem {
  public static getBody() {
    return (doctorStats: DoctorStat): DoctorStatisticsItem => {
      const {
        name,
        median,
        average,
        max,
        all,
        min,
        success,
        closedByClient,
        ratingAverage,
        ratingMedian,
        failure,
      } = doctorStats
      return {
        name,
        average: formatTimestamp(average),
        median: formatTimestamp(median),
        max: formatTimestamp(max),
        all,
        success,
        closedByClient,
        ratingAverage,
        ratingMedian,
        failure,
      }
    }
  }

  public static getHeader(): DoctorStatisticsItem {
    return {
      name: 'Имя',
      average: 'Среднее время ответа',
      median: 'Медианное время ответа',
      max: 'Максимальное время ответа',
      all: 'Всего заявок',
      success: 'Заявок, закрытых вовремя',
      closedByClient: 'Закрытых клиентом заявок',
      ratingAverage: 'Среднее время',
      ratingMedian: 'Медианное время',
      failure: 'Просроченных заявок',
    }
  }

  public readonly name: string
  public readonly average: string
  public readonly median: string
  public readonly max: string
  public readonly all: string
  public readonly success: string
  public readonly failure: string
  public readonly closedByClient: string
  public readonly ratingAverage: string
  public readonly ratingMedian: string
}
