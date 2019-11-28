export interface RatingValueQuestion {
  question: string,
  order: number,
  answers: {
    [x: string]: {
      count: number
      percentage: string
    }
  }[]
}
