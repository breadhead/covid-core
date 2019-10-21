export interface RatingValueQuestion {
  [key: string]: {
    [key: string]: {
      count: number
      percentage: string
    }
  }[]
}
