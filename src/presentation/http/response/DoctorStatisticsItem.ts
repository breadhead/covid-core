interface DoctorStat {
  name: any
  median: any
  average: any
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
        median,
        average,
        max,
        min,
        success,
        failure,
      }
    }
  }

  public static getHeader(): DoctorStatisticsItem {
    return {
      name: 'Имя',
      median: 'Медианное время ответа',
      average: 'Среднее время ответа',
      max: 'Максимальное время ответа',
      min: 'Минимальное время ответа',
      success: 'Заявок, закрытых вовремя',
      failure: 'Просроченных заявок',
    }
  }

  public readonly name: string
  public readonly median: string
  public readonly average: string
  public readonly max: string
  public readonly min: string
  public readonly success: string
  public readonly failure: string
}
