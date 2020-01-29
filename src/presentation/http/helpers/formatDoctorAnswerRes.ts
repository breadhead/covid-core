import { DoctorStat } from '../response/DoctorAnswerTimeResponse'
import { DoctorRatingResponse } from '../response/DoctorRatingResponse'

export const formatDoctorAnswerRes = (
  doctors: DoctorStat[],
  rating: DoctorRatingResponse[],
): any => {
  const res = doctors.map(doctor => {
    if (rating.length === 0) {
      return doctor
    }

    const doc = rating
      .filter(rat => doctor.name === rat.doctor)
      .map(rat => {
        return {
          ...doctor,
          ratingAverage: rat.ratingAverage,
          ratingMedian: rat.ratingMedian,
        }
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

  return res
}
