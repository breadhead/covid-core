import { LoggerService } from '@nestjs/common'

export abstract class Logger implements LoggerService {
  abstract log(message: any, context?: any): Promise<void>

  abstract warn(message: any, context?: string): Promise<void>

  abstract error(message: any, trace?: string, context?: string): Promise<void>
}
