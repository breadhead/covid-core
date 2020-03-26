import { Injectable } from '@nestjs/common';
import {
  CommandConfiguration,
  ConsoleCommand,
  Input,
  Output,
} from '@solid-soda/console/dist';

import {DataSender} from "@app/presentation/cli/airtable/DataSender";

@Injectable()
export class AirtableCommand implements ConsoleCommand {
  public constructor(
    private readonly dataSender: DataSender,
  ) {
    //
  }

  public configure = (): CommandConfiguration => ({
    name: 'airtable',
  });

  public execute = async (input: Input, output: Output) => {
    try {
      await output.info('started');

      await this.dataSender.sendForms();

      await output.success('Done!');
    } catch (error) {
      console.log(error);
      await output.error(`${error.statusMessage} something went wrong`);
    }
  };
}
