import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import { compile, TemplateDelegate } from 'handlebars'
import * as path from 'path'
import { promisify } from 'util'

import Configuration from '../Configuration/Configuration'
import TemplateEngine, { Context } from './TemplateEngine'

@Injectable()
export default class HandlebarsTemplateEngine implements TemplateEngine {
  private readonly readFile: (filepath: string) => Promise<string>
  private compiled: { [key: string]: TemplateDelegate } = {}

  public constructor(private readonly config: Configuration) {
    this.readFile = (filepath: string) =>
      promisify(fs.readFile)(filepath)
        .then((data) => data.toString())
  }

  public async render(name: string, context: Context): Promise<string> {
    const compiled = this.compiled[name]
      || await this.compile(name)

    return compiled(context)
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
