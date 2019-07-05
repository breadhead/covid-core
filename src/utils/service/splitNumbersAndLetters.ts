interface LettersAndNumbers {
  letters: string[]
  numbers: number[]
}

type SplitNumbersAndLetters = (str: string) => LettersAndNumbers

export const splitNumbersAndLetters: SplitNumbersAndLetters = str => {
  const matches = str.match(/[a-z]+|[^a-z]+/gi)

  const numbers = matches
    .filter(match => !isNaN(parseFloat(match)))
    .map(match => parseFloat(match))

  const letters = matches.filter(match => isNaN(parseFloat(match)))

  return {
    numbers,
    letters,
  }
}
