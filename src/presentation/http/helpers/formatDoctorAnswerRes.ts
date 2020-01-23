import { DoctorStat } from '../response/DoctorAnswerTimeResponse'
import { DoctorRatingResponse } from '../response/DoctorRatingResponse'

export const formatDoctorAnswerRes = (
  doctors: DoctorStat[],
  rating: DoctorRatingResponse[],
): any => {
  const res = doctors
    .map(doctor => {
      if (rating.length === 0) {
        return doctor
      }

      const doc = rating.map(rat => {
        if (doctor.name === rat.doctor) {
          return {
            ...doctor,
            ratingAverage: rat.ratingAverage,
            ratingMedian: rat.ratingMedian,
          }
        }
      })

      const filteredDoc =
        doc.filter(it => !!it).length > 0 ? doc.filter(it => !!it)[0] : null

      const ans = !!filteredDoc
        ? filteredDoc
        : {
            ...doctor,
            ratingAverage: 0,
            ratingMedian: 0,
          }
      return ans
    })
    .filter(it => !!it)

  return res
}
