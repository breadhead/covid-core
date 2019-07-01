import { Injectable } from '@nestjs/common'
import * as path from 'path'
import * as Twig from 'twig'

import Processor from './processors/Processor'
import TemplateEngine, { Context } from './TemplateEngine'

@Injectable()
export default class TwigTemplateEngine implements TemplateEngine {
  private processors: Processor[] = []

  public addProcessor(processor: Processor): void {
    this.processors = [...new Set([...this.processors, processor])]
  }

  public async render(name: string, context: Context): Promise<string> {
    const rawHtml = new Promise((resolve, reject) => {
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
    }) as Promise<string>

    return this.processors.reduce(
      (currentPromise, processor) => currentPromise.then(processor.process),
      rawHtml,
    )
  }
}
