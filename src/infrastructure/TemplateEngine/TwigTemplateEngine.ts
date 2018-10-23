import { Injectable } from '@nestjs/common'
import * as path from 'path'
import * as Twig from 'twig'

import TemplateEngine, { Context } from './TemplateEngine'

@Injectable()
export default class TwigTemplateEngine implements TemplateEngine {
  public render(name: string, context: Context): Promise<string> {
    return new Promise((resolve, reject) => {
      Twig.renderFile(
        path.resolve(__dirname, `../../../templates/${name}.twig`),
        context,
        (err, html) => {
          if (err) {
            reject(err)
          }

          resolve(html)
        })
    })
  }
}
