import { Injectable } from '@nestjs/common'
import {
  CommandConfiguration,
  ConsoleCommand,
  Input,
  Output,
} from '@solid-soda/console'

import { UserCreator } from '@app/user/application/UserCreator'

@Injectable()
export default class DoctorCommand implements ConsoleCommand {
  public constructor(private readonly userCreator: UserCreator) {}

  public configure = (): CommandConfiguration => ({
    name: 'doctor',
    positionArgs: [
      {
        name: 'email',
        required: true,
      },
      {
        name: 'password',
        required: true,
      },
    ],
    namedArgs: [
      {
        name: 'name',
        required: true,
      },
      {
        name: 'boardUsername',
        required: true,
      },
      'desciption',
    ],
  })

  public execute = async (input: Input, output: Output) => {
    const {
      email,
      password,
      name,
      description,
      boardUsername,
    } = this.createDoctorRequest(input)

    try {
      await this.userCreator.createDoctor(
        email,
        password,
        name,
        boardUsername,
        description.getOrElse(null),
      )

      await output.success('Doctor account successfully created')

      await output.info(`Login: ${email}`)
      await output.info(`Password: ${password}`)
    } catch (e) {
      await output.error('Somwthing went wrong')
      throw e
    }
  }

  private createDoctorRequest = (input: Input) => ({
    email: input.getPositionArg('email'),
    password: input.getPositionArg('password'),
    name: input.getNamedArg('name'),
    description: input.getOptionalNamedArg('desciption'),
    boardUsername: input.getNamedArg('boardUsername'),
  })
}
