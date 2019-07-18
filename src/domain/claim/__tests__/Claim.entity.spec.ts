import Gender from '../../../infrastructure/customTypes/Gender'
import InvariantViolationException from '../../exception/InvariantViolationException'
import Quota from '../../quota/Quota.entity'
import Applicant from '../Applicant.vo'
import Claim from '../Claim.entity'
import { User } from '@app/user/model/User.entity'

describe('Claim', () => {
  let applicant: Applicant
  let user: User

  beforeAll(() => {
    applicant = new Applicant('Petr', 12, Gender.unknown, 'Tomsk')
    user = new User('login')
  })

  const createMockClaim = () =>
    new Claim(
      '1',
      1,
      new Date(),
      new Date(),
      new Date(),
      applicant,
      user,
      'theme',
    )

  describe('bindQuota', () => {
    test('should bind quota correctly', () => {
      const c = createMockClaim()
      const q = new Quota('1', 'quota first')

      c.bindQuota(q)

      expect(c.quota.id).toBe(q.id)
      expect(c.quota.name).toBe(q.name)
    })
  })

  describe('unbindQuota', () => {
    test('should unbind quota correctly', () => {
      const c = createMockClaim()
      const q = new Quota('1', 'quota first')

      c.bindQuota(q)

      c.unbindQuota()

      expect(c.quota).toBeNull()
    })

    test('should throw excaption ig try to unbind empty quota', () => {
      const c = createMockClaim()

      expect(() => c.unbindQuota()).toThrow(InvariantViolationException)
    })
  })

  describe('answerQuestions', () => {
    test('should not remove any questions if answers does not provided', () => {
      const c = createMockClaim()

      const defaultQuestions = ['Как быть?', 'Вопрос: Что делать?']
      const additionalQuestions = [
        'Это довольный длинный вопрос с, спорными: символами и другими?(солжностями]',
      ]

      c.newQuestions(defaultQuestions, additionalQuestions)

      c.answerQuestions([])

      expect(c.questions.defaultQuestions).toEqual(defaultQuestions)
      expect(c.questions.additionalQuestions).toEqual(additionalQuestions)
    })

    test('should not remove any questions if incorrect answers provided', () => {
      const c = createMockClaim()

      const defaultQuestions = ['Как быть?', 'Вопрос: Что делать?']
      const additionalQuestions = [
        'Это довольный длинный вопрос с, спорными: символами и другими?(солжностями]',
      ]

      c.newQuestions(defaultQuestions, additionalQuestions)

      c.answerQuestions([{ question: 'Что?', answer: 'Ничего!' }])

      expect(c.questions.defaultQuestions).toEqual(defaultQuestions)
      expect(c.questions.additionalQuestions).toEqual(additionalQuestions)
    })

    test('should add answers if they correct', () => {
      const c = createMockClaim()

      const defaultQuestions = ['Как быть?', 'Вопрос: Что делать?']
      const additionalQuestions = [
        'Это довольный длинный вопрос с, спорными: символами и другими?(солжностями]',
      ]

      c.newQuestions(defaultQuestions, additionalQuestions)

      c.answerQuestions([{ question: 'Как быть?', answer: 'Забей' }])

      expect(c.questions.defaultQuestions).toEqual(defaultQuestions)
      expect(c.questions.additionalQuestions).toEqual(additionalQuestions)

      expect(c.answeredQuestions.defaultQuestions).toEqual([
        { question: 'Как быть?', answer: 'Забей' },
        {
          answer: undefined,
          question: 'Вопрос: Что делать?',
        },
      ])
    })

    test('should add answers if some of they correct', () => {
      const c = createMockClaim()

      const defaultQuestions = ['Как быть?', 'Вопрос: Что делать?']
      const additionalQuestions = [
        'Это довольный длинный вопрос с, спорными: символами и другими?(солжностями]',
      ]

      c.newQuestions(defaultQuestions, additionalQuestions)

      c.answerQuestions([
        { question: 'Как быть?', answer: 'Забей' },
        { question: 'Не вопрос?', answer: 'Не вопрос' },
      ])

      expect(c.questions.defaultQuestions).toEqual(defaultQuestions)
      expect(c.questions.additionalQuestions).toEqual(additionalQuestions)

      expect(c.answeredQuestions.defaultQuestions).toEqual([
        { question: 'Как быть?', answer: 'Забей' },
        {
          answer: undefined,
          question: 'Вопрос: Что делать?',
        },
      ])
    })
  })
})
