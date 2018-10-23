export default interface Processor {
  process(html: string): Promise<string>
}
