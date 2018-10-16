import TokenPayload from '../TokenPayload'

export default interface SecurityVoter<Subject = any> {
  supports(attribute: string, subject: any): boolean
  voteOnAttribute(attribute: string, subject: Subject, token: TokenPayload): Promise<boolean>
}
