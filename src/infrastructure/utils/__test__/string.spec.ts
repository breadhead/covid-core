import { strip } from '../string'

describe('strip', () => {

  test('should strip symbols from start', () => {
    const input = 'hhhhhhhhhYo'
    expect(strip(/h+/g)(input)).toBe('Yo')
  })

  test('should strip symbols from end', () => {
    const input = 'World`'
    expect(strip(/`+/g)(input)).toBe('World')
  })
  test('should strip all symbols', () => {
    const input = 'aaaaaaaHelloaaaaaaaa'
    expect(strip(/a+/g)(input)).toBe('Hello')
  })
})
