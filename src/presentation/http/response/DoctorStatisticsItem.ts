import { formatTimestamp } from '@app/utils/service/formatTimestamp'

interface DoctorStat {
  name: any
  average: any
  median: any
  min: any
  max: any
  success: any
  failure: any
}

export class DoctorStatisticsItem {
  public static getBody() {
    return (doctorStats: DoctorStat): DoctorStatisticsItem => {
      const { name, median, average, max, min, success, failure } = doctorStats
      return {
        name,
        average: formatTimestamp(average),
        median: formatTimestamp(median),
        max: formatTimestamp(max),
        success,
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
      success: 'Заявок, закрытых вовремя',
      failure: 'Просроченных заявок',
    }
  }

  public readonly name: string
  public readonly average: string
  public readonly median: string
  public readonly max: string
  public readonly success: string
  public readonly failure: string
}
