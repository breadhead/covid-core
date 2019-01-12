import { ICommand } from '@nestjs/cqrs'

import BaseShortClaimCommand from './BaseShortClaimCommand'

export default class CreateClaimCommand extends BaseShortClaimCommand
  implements ICommand {}
