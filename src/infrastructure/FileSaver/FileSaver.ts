export default interface FileSaver {
  save(buffer: Buffer, originalName: string): Promise<string>
}

const FileSaver = Symbol('FileSaver')

export { FileSaver }
