import { CommandBus } from '@breadhead/nest-throwable-bus'
import { Injectable } from '@nestjs/common'
import {
  CommandConfiguration,
  ConsoleCommand,
  Input,
  Output,
} from '@solid-soda/console'

import CreateDoctorCommand from '@app/application/user/createUser/CreateDoctorCommand'

@Injectable()
export default class DoctorCommand implements ConsoleCommand {
  public constructor(private readonly bus: CommandBus) {}

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

    const command = new CreateDoctorCommand(
      email,
      password,
      name,
      boardUsername,
      description.getOrElse(null),
    )

    try {
      const created: boolean = await this.bus.execute(command)
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
