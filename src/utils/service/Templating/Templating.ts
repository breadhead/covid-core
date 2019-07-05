import { Processor } from './processors/Processor'
import { Context } from './Context'

export abstract class Templating {
  abstract render(
    name: string,
    context: Context,
    processors?: Processor[],
  ): Promise<string>

  abstract createRender(
    processors: Processor[],
  ): (name: string, context: Context) => Promise<string>
}
