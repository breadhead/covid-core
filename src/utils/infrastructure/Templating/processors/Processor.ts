export interface Processor {
  process(html: string): Promise<string>
}
