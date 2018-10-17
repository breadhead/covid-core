import * as fs from 'fs'
import * as handlebars from 'handlebars'
import * as path from 'path'
import { promisify } from 'util'

import TemplateEngine, { Context } from './TemplateEngine'

export default class HandlebarsTemplateEngine implements TemplateEngine {
  private readonly readFile: (filepath: string) => Promise<string>
  private compiled: { [key: string]: handlebars.TemplateDelegate } = {}

  public constructor() {
    this.readFile = (filepath: string) =>
      promisify(fs.readFile)(filepath)
        .then((data) => data.toString())
  }

  public async render(name: string, context: Context): Promise<string> {
    const compiled = this.compiled[name]
      || await this.compile(name)

    return compiled(context)
  }

  private async compile(name: string): Promise<handlebars.TemplateDelegate> {
    const template = await this.readFile(path.resolve(__dirname, `../../../templates/${name}.hbs`))

    return handlebars.compile(template)
  }
}
