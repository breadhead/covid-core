import { SecutiryVoter } from '@solid-soda/voters'

import TokenPayload from '../TokenPayload'

export default interface SecurityVoterWrapper<Subject = any>
  extends SecutiryVoter<Subject, TokenPayload> {}
