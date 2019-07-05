import { Inject, Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { SecurityVotersUnity, Strategy } from '@solid-soda/voters'

import { Configuration } from '@app/config/Configuration'

import SecurityException from '../SecurityException'
import TokenPayload from '../TokenPayload'
import Attribute from './Attribute'

export default class SecurityVotersUnityAdapter {
  private moduleRef: ModuleRef
  private votersUnity: SecurityVotersUnity

  public constructor(
    @Inject(Configuration) private readonly config: Configuration,
  ) {}

  public setModuleRef(ref: ModuleRef): void {
    this.moduleRef = ref
  }

  public register(voterFunctions: Array<Type<any>>): void {
    const voters = voterFunctions.map(voterFunction =>
      this.moduleRef.get(voterFunction),
    )

    const strategy = this.config
      .get('SECURITY_STRATEGY')
      .map(str => str as Strategy)
      .getOrElse(Strategy.Unanimous)

    const allowIfAllAbstain = this.config
      .get('SECURITY_ALLOW_IF_ALL_ABSTAIN')
      .map(parseInt)
      .map(Boolean)
      .getOrElse(false)

    this.votersUnity = new SecurityVotersUnity(
      voters,
      strategy,
      allowIfAllAbstain,
    )
  }

  public async denyAccessUnlessGranted<Subject = any>(
    attribute: Attribute,
    subject: Subject,
    token: TokenPayload,
  ): Promise<void> {
    try {
      await this.votersUnity.denyAccessUnlessGranted(attribute, subject, token)
    } catch (e) {
      throw new SecurityException(token, e.message)
    }
  }
}
