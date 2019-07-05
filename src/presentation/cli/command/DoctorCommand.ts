import { Injectable } from '@nestjs/common'
import {
  CommandConfiguration,
  ConsoleCommand,
  Input,
  Output,
} from '@solid-soda/console'

import { DoctorManager } from '@app/user/application/DoctorManager'

@Injectable()
export default class DoctorCommand implements ConsoleCommand {
  public constructor(private readonly doctorManager: DoctorManager) {}

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
      const created: boolean = await this.doctorManager.createOrEdit(
        email,
        password,
        name,
        boardUsername,
        description.getOrElse(null),
      )

      if (created) {
        await output.success('Doctor account successfully created')
      } else {
        await output.success('Doctor account successfully edited')
      }

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
