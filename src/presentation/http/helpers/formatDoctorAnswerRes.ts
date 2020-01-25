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

        return null
      })

      const filteredDoc =
        doc.filter(it => !!it).length > 0 ? doc.filter(it => !!it)[0] : null

      return !!filteredDoc
        ? filteredDoc
        : {
          ...doctor,
          ratingAverage: 0,
          ratingMedian: 0,
        }
    })
    .filter(it => !!it)

  return res
}
