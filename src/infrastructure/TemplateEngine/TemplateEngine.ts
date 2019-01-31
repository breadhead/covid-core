import Processor from './processors/Processor'

export interface Context {
  [key: string]: string | Context
}

export default interface TemplateEngine {
  addProcessor(processor: Processor): void
  render(name: string, context: Context): Promise<string>
}

const TemplateEngine = Symbol('TemplateEngine')

export { TemplateEngine }
