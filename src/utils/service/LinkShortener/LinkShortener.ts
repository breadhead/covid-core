export abstract class LinkShortener {
  abstract getShort(link: string): Promise<string>
}
