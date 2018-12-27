import { ICommand } from '@nestjs/cqrs'

import File from './dto/File'
import MedicinalTreatment from './dto/MedicinalTreatment'
import MonthYear from './dto/MonthYear'
import RadiationTreatment from './dto/RadiationTreatment'
import RelativeDisease from './dto/RelativeDisease'
import SurgicalTreatment from './dto/SurgicalTreatment'

export default class EditSituationCommand implements ICommand {
  public constructor(
    public readonly id: string,
    public readonly description: string,
    public readonly feeling: string,
    public readonly diagnosis?: string,
    public readonly stage?: string,
    public readonly otherDisease?: string,
    public readonly worst?: string,
    public readonly complaint?: string,
    public readonly nowTreatment?: string,
    public readonly relativesDiseases: RelativeDisease[] = [],
    public readonly surgicalTreatments: SurgicalTreatment[] = [],
    public readonly medicalsTreatments: MedicinalTreatment[] = [],
    public readonly radiationTreatments: RadiationTreatment[] = [],
    public readonly histology?: File,
    public readonly discharge?: File,
    public readonly otherFiles: File[] = [],
    public readonly diagnosisDate?: MonthYear,
  ) {}
}
