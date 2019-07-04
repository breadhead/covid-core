import { Injectable } from '@nestjs/common'
import * as path from 'path'
import * as Twig from 'twig'

import { Processor } from './processors/Processor'
import { Templating } from './Templating'
import { Context } from './Context'

@Injectable()
export class TwigTemplating implements Templating {
  async render(
    name: string,
    context: Context,
    processors: Processor[] = [],
  ): Promise<string> {
    const rawHtml = this.renderTwig(name, context)

    return this.applyProcessors(rawHtml, processors)
  }

  createRender = (processors: Processor[]) => (
    name: string,
    context: Context,
  ) => this.render(name, context, processors)

  private renderTwig(name: string, context: Context): Promise<string> {
    return new Promise((resolve, reject) => {
      Twig.renderFile(
        path.resolve(__dirname, `../../../templates/${name}.twig`),
        context,
        (err, html) => {
          if (err) {
            reject(err)
          }

          resolve(html)
        },
      )
    })
  }

  private applyProcessors(
    raw: Promise<string>,
    processors: Processor[],
  ): Promise<string> {
    return processors.reduce(
      (currentPromise, processor) => currentPromise.then(processor.process),
      raw,
    )
  }
}
