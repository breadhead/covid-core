export interface ClaimsRatingDoctors {
  doctor: string,
  questions: ClaimsRatingQuestions[]
}

export interface ClaimsRatingQuestions {
  id: string,
  type: string,
  value: string
}