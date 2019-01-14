import Gender from '../../../infrastructure/customTypes/Gender'
import InvariantViolationException from '../../exception/InvariantViolationException'
import Quota from '../../quota/Quota.entity'
import User from '../../user/User.entity'
import Applicant from '../Applicant.vo'
import Claim from '../Claim.entity'

describe('Claim', () => {
  let applicant: Applicant
  let user: User

  beforeAll(() => {
    applicant = new Applicant('Petr', 12, Gender.unknown, 'Tomsk')
    user = new User('login')
  })

  describe('bindQuota', () => {
    test('should bind quota correctly', () => {
      const c = new Claim('1', 1, new Date(), applicant, user, 'theme')
      const q = new Quota('1', 'quota first')

      c.bindQuota(q)

      expect(c.quota.id).toBe(q.id)
      expect(c.quota.name).toBe(q.name)
    })

    test('should throw exception if quota already binded', () => {
      const c = new Claim('1', 1, new Date(), applicant, user, 'theme')
      const oldQ = new Quota('1', 'quota first')
      const newQ = new Quota('2', 'quota second')

      c.bindQuota(oldQ)

      expect(() => c.bindQuota(newQ)).toThrow(InvariantViolationException)
    })
  })

  describe('unbindQuota', () => {
    test('should unbind quota correctly', () => {
      const c = new Claim('1', 1, new Date(), applicant, user, 'theme')
      const q = new Quota('1', 'quota first')

      c.bindQuota(q)

      c.unbindQuota()

      expect(c.quota).toBeNull()
    })

    test('should throw excaption ig try to unbind empty quota', () => {
      const c = new Claim('1', 1, new Date(), applicant, user, 'theme')

      expect(() => c.unbindQuota()).toThrow(InvariantViolationException)
    })
  })
})
