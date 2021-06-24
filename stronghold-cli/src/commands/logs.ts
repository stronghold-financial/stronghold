import { StrongholdCommand } from '../command'
import { StrongholdNode, ConsoleReporterInstance } from 'stronghold'
import { RemoteFlags } from '../flags'
import { logType } from 'consola'

export default class LogsCommand extends StrongholdCommand {
  static description = 'Tail server logs'

  static flags = {
    ...RemoteFlags,
  }

  node: StrongholdNode | null = null

  async start(): Promise<void> {
    this.parse(LogsCommand)

    await this.sdk.client.connect()

    const response = this.sdk.client.getLogStream()

    for await (const value of response.contentStream()) {
      ConsoleReporterInstance.log({
        level: Number(value.level),
        type: value.type as logType,
        tag: value.tag,
        args: value.args,
        date: new Date(value.date),
      })
    }

    this.exit(0)
  }
}
