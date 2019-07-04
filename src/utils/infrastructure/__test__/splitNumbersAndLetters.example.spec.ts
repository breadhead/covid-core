import { splitNumbersAndLetters } from '../splitNumbersAndLetters'

describe('splitNumbersAndLetters', () => {
  test('should split simple string', () => {
    const str = '12fd'

    const result = splitNumbersAndLetters(str)

    expect(result.letters).toHaveLength(1)
    expect(result.letters[0]).toBe('fd')

    expect(result.numbers).toHaveLength(1)
    expect(result.numbers[0]).toBe(12)
  })

  test('should split complex string', () => {
    const str = '12f12.4dfdsf144'

    const result = splitNumbersAndLetters(str)

    expect(result.letters).toHaveLength(2)
    expect(result.letters[0]).toBe('f')
    expect(result.letters[1]).toBe('dfdsf')

    expect(result.numbers).toHaveLength(3)
    expect(result.numbers[0]).toBe(12)
    expect(result.numbers[1]).toBe(12.4)
    expect(result.numbers[2]).toBe(144)
  })
})
