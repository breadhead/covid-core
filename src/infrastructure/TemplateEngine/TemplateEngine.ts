export interface Context {
  [key: string]: string | Context
}

export default interface TemplateEngine {
  render(name: string, context: Context): Promise<string>
}

const TemplateEngine = Symbol('TemplateEngine')

export {
  TemplateEngine,
}
