import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import { compile, TemplateDelegate } from 'handlebars'
import * as path from 'path'
import { promisify } from 'util'

import Configuration from '../Configuration/Configuration'
import Processor from './processors/Processor'
import StyleInlinerProcessor from './processors/StyleInlinerProcessor'
import TemplateEngine, { Context } from './TemplateEngine'

@Injectable()
export default class HandlebarsTemplateEngine implements TemplateEngine {
  private readonly processors: Processor[]

  private readonly readFile: (filepath: string) => Promise<string>
  private compiled: { [key: string]: TemplateDelegate } = {}

  public constructor(private readonly config: Configuration) {
    this.readFile = (filepath: string) =>
      promisify(fs.readFile)(filepath)
        .then((data) => data.toString())

    this.processors = [
      new StyleInlinerProcessor(),
    ]
  }

  public async render(name: string, context: Context): Promise<string> {
    const compiled = this.compiled[name]
      || await this.compile(name)

    const html = compiled(context)

    const processed = await this.process(html)

    return processed
  }

  private async process(html: string): Promise<string> {
    let resultHtml = html
    for (const processor of this.processors) {
      resultHtml = await processor.process(resultHtml)
    }

    return resultHtml
  }

  private async compile(name: string): Promise<TemplateDelegate> {
    const template = await this.readFile(path.resolve(__dirname, `../../../templates/${name}.hbs`))

    const compiledTemplate = compile(template)
    if (this.config.isProd()) {
      this.compiled[name] = compiledTemplate
    }

    return compiledTemplate
  }
}
