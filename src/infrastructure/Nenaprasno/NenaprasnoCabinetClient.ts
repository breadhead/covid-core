import { HttpService, Injectable } from '@nestjs/common'

@Injectable()
export default class NenaprasnoCabinetClient {
  public constructor(
    private readonly http: HttpService,
  ) {}

  public async findId(login: string): Promise<number | null> {
    return 12 // TODO: check
  }

  public async valid(id: number, password: string): Promise<boolean> {
    return true // TODO: signIn
  }
}
