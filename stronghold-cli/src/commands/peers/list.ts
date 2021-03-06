import { cli, Table } from 'cli-ux'
import { flags } from '@oclif/command'
import { StrongholdCommand } from '../../command'
import { PromiseUtils, GetPeersResponse } from 'stronghold'
import { RemoteFlags } from '../../flags'
import blessed from 'blessed'

type GetPeerResponsePeer = GetPeersResponse['peers'][0]

const STATE_COLUMN_HEADER = 'STATE'

export class ListCommand extends StrongholdCommand {
  static description = `List all connected peers`

  static flags = {
    ...RemoteFlags,
    follow: flags.boolean({
      char: 'f',
      default: false,
      description: 'follow the peers list live',
    }),
    all: flags.boolean({
      default: false,
      description: 'show all peers, not just connected peers',
    }),
    extended: flags.boolean({
      char: 'e',
      default: false,
      description: 'display all information',
    }),
    sort: flags.string({
      char: 'o',
      default: STATE_COLUMN_HEADER,
      description: 'sort by column header',
    }),
    agents: flags.boolean({
      char: 'a',
      default: false,
      description: 'display peer agents',
    }),
    sequence: flags.boolean({
      char: 's',
      default: false,
      description: 'display peer head sequence',
    }),
    names: flags.boolean({
      char: 'n',
      default: false,
      description: 'display node names',
      hidden: true,
    }),
  }

  async start(): Promise<void> {
    const { flags } = this.parse(ListCommand)

    if (!flags.follow) {
      await this.sdk.client.connect()
      const response = await this.sdk.client.getPeers()
      this.log(renderTable(response.content, flags))
      this.exit(0)
    }

    // Console log will create display issues with Blessed
    this.logger.pauseLogs()

    const screen = blessed.screen({ smartCSR: true })
    const text = blessed.text()
    screen.append(text)

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const connected = await this.sdk.client.tryConnect()
      if (!connected) {
        text.clearBaseLine(0)
        text.setContent('Connecting...')
        screen.render()
        await PromiseUtils.sleep(1000)
        continue
      }

      const response = this.sdk.client.getPeersStream()

      for await (const value of response.contentStream()) {
        text.clearBaseLine(0)
        text.setContent(renderTable(value, flags))
        screen.render()
      }
    }
  }
}

function renderTable(
  content: GetPeersResponse,
  flags: {
    extended: boolean
    names: boolean
    all: boolean
    sort: string
    agents: boolean
    sequence: boolean
  },
): string {
  let columns: Table.table.Columns<GetPeerResponsePeer> = {
    identity: {
      header: 'IDENTITY',
      get: (row: GetPeerResponsePeer) => {
        return row.identity || '-'
      },
    },
  }

  if (flags.names) {
    columns['name'] = {
      header: 'NAME',
      minWidth: 5,
      get: (row: GetPeerResponsePeer) => {
        return row.name || '-'
      },
    }
  }

  if (flags.agents) {
    columns['agents'] = {
      header: 'AGENT',
      minWidth: 5,
      get: (row: GetPeerResponsePeer) => {
        return row.agent || '-'
      },
    }
  }

  if (flags.sequence) {
    columns['sequence'] = {
      header: 'SEQ',
      minWidth: 2,
      get: (row: GetPeerResponsePeer) => {
        return row.sequence || '-'
      },
    }
  }

  columns = {
    ...columns,
    state: {
      header: STATE_COLUMN_HEADER,
      minWidth: 15,
      get: (row: GetPeerResponsePeer) => {
        return row.state + (row.error ? '(!)' : '')
      },
    },
    address: {
      header: 'ADDRESS',
      minWidth: 7,
      get: (row: GetPeerResponsePeer) => {
        let address = ''
        if (row.address) address += row.address
        if (row.port) address += ':' + String(row.port)
        return address
      },
    },
    connectionWebSocket: {
      header: 'SOCKET',
      minWidth: 4,
      extended: true,
      get: (row: GetPeerResponsePeer) => {
        return row.connectionWebSocket + (row.connectionWebSocketError ? ' (!)' : '') || '-'
      },
    },
    connectionWebRTC: {
      header: 'RTC',
      minWidth: 5,
      extended: true,
      get: (row: GetPeerResponsePeer) => {
        return row.connectionWebRTC + (row.connectionWebRTCError ? ' (!)' : '') || '-'
      },
    },
    error: {
      header: 'ERROR',
      minWidth: 5,
      extended: true,
      get: (row: GetPeerResponsePeer) => {
        return row.error || '-'
      },
    },
  }

  let peers = content.peers

  if (!flags.all) {
    peers = peers.filter((p) => p.state === 'CONNECTED')
  }

  let result = ''

  cli.table(peers, columns, {
    printLine: (line) => (result += `${String(line)}\n`),
    extended: flags.extended,
    sort: flags.sort,
  })

  return result
}
