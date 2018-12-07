import TokenPayload from '../TokenPayload'
import Attribute from './Attribute'

export default interface SecurityVoter<Subject = any> {
  supports(attribute: Attribute, subject: any): boolean
  voteOnAttribute(
    attribute: Attribute,
    subject: Subject,
    token: TokenPayload,
  ): Promise<boolean>
}
