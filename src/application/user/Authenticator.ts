import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'

import UserRepository from '@app/domain/user/UserRepository'

import TokenPayload from './TokenPayload'

@Injectable()
export default class Authenticator {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async signIn(): Promise<string> {
    // In the real-world app you shouldn't expose this method publicly
    // instead, return a token once you verify user credentials
    const user: TokenPayload = { login: 'user@email.com' }
    return this.jwtService.sign(user)
  }

  public async validateUser(token: string): Promise<any> {
    // return await this.userRepo.findOne(token)
    return Promise.resolve({ hello: 'ok' })
  }
}
