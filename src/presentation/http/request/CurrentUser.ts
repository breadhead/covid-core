import { createParamDecorator } from '@nestjs/common'

import TokenPayload from '@app/application/user/TokenPayload'

import LogicException from '../exception/LogicException'

export default createParamDecorator(async (_, req): Promise<TokenPayload> => {
  const payload: TokenPayload = req.user

  if (!payload) {
    throw new LogicException('Try to get current user in anonymous endpoint!')
  }

  return payload
})
