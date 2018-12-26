import { ApiModelProperty } from '@nestjs/swagger'

import Claim from '@app/domain/claim/Claim.entity'

import FileData, { fileDataExample } from './FileData'
import RelativeDiseaseData, { relativeExampleData } from './RelativeDiseaseData'
import MedicinalTreatment, {
  exampleMidicalTreatment,
} from './treatment/MedicinalTreatment'
import RadiationTreatment, {
  exampleRadiationTreatment,
} from './treatment/RadiationTreatment'
import SurgicalTreatment, {
  exampleSurgicalTreatment,
} from './treatment/SurgicalTreatment'

const situationExample: SituationClaimData = {
  id: 'fdfs',
  description: 'Мне очень-очень плохо',
  diagnosis: 'Рак всего',
  stage: 'Последняя',
  otherDisease: 'Насморк у меня',
  relativesDiseases: [relativeExampleData],
  feeling: 'Мне норм',
  worst: 'Сплю плохо',
  complaint: 'Бессоница!',
  nowTreatment: 'У бабушки пью травки',
  surgicalTreatments: [exampleSurgicalTreatment],
  medicalsTreatments: [exampleMidicalTreatment],
  radiationTreatments: [exampleRadiationTreatment],
  histology: fileDataExample,
  discharge: fileDataExample,
  otherFiles: [fileDataExample],
}

export default class SituationClaimData {
  public static fromEntity(claim: Claim): SituationClaimData {
    const { analysis, relativesDiseases } = claim
    const { histology, discharge, other } = analysis

    return {
      ...situationExample,
      id: claim.id,
      histology: FileData.fromFileLink(histology),
      discharge: FileData.fromFileLink(discharge),
      otherFiles: other.map(file => FileData.fromFileLink(file)),
      relativesDiseases,
    }
  }

  @ApiModelProperty({ example: situationExample.id })
  public readonly id: string

  @ApiModelProperty({ example: situationExample.description })
  public readonly description: string

  @ApiModelProperty({ example: situationExample.diagnosis, required: false })
  public readonly diagnosis?: string

  @ApiModelProperty({ example: situationExample.stage, required: false })
  public readonly stage?: string

  @ApiModelProperty({ example: situationExample.otherDisease, required: false })
  public readonly otherDisease?: string

  @ApiModelProperty({ example: situationExample.relativesDiseases })
  public readonly relativesDiseases: RelativeDiseaseData[]

  @ApiModelProperty({ example: situationExample.feeling, required: false })
  public readonly feeling: string

  @ApiModelProperty({ example: situationExample.worst, required: false })
  public readonly worst?: string

  @ApiModelProperty({ example: situationExample.complaint, required: false })
  public readonly complaint?: string

  @ApiModelProperty({ example: situationExample.nowTreatment, required: false })
  public readonly nowTreatment?: string

  @ApiModelProperty({ example: situationExample.surgicalTreatments })
  public readonly surgicalTreatments: SurgicalTreatment[]

  @ApiModelProperty({ example: situationExample.medicalsTreatments })
  public readonly medicalsTreatments: MedicinalTreatment[]

  @ApiModelProperty({ example: situationExample.radiationTreatments })
  public readonly radiationTreatments: RadiationTreatment[]

  @ApiModelProperty({ example: situationExample.histology, required: false })
  public readonly histology?: FileData

  @ApiModelProperty({ example: situationExample.discharge, required: false })
  public readonly discharge?: FileData

  @ApiModelProperty({ example: situationExample.otherFiles })
  public readonly otherFiles: FileData[]
}
