type Strip = (sym: RegExp | string) => (string) => string
export const strip: Strip = (sym) => (target) => target.replace(sym, '')

type SplitNumbersAndLetters = (str: string) => {
  letters: string[],
  numbers: number[],
}
export const splitNumbersAndLetters: SplitNumbersAndLetters = (str) => {
  const matches = str.match(/[a-z]+|[^a-z]+/gi)

  const numbers = matches
    .filter((match) => !isNaN(parseFloat(match)))
    .map((match) => parseFloat(match))

  const letters = matches
    .filter((match) => isNaN(parseFloat(match)))

  return {
    numbers,
    letters,
  }
}
