import { command } from '@mosteast/command'
import { Component } from './component'
import { Invalid_argument } from './error/invalid_argument'
import { Not_supported } from './error/not_supported'
import { Os } from './os'

export enum N_supported_web_server {
  nginx = 'nginx'
}

export class Server extends Component {
  os: Os

  type: N_supported_web_server = N_supported_web_server.nginx

  /**
   * Check if server is installed
   */
  async installed(): Promise<boolean> {
    const type = this.type
    switch (type) {
      case N_supported_web_server.nginx:
        const r = await command(`nginx -v`)
        return r.ok
        break
    }

    return false
  }

  async install() {
    switch (this.type) {
      case N_supported_web_server.nginx:
        const os_type = this.os.type
        switch (os_type) {
          case 'Linux':
            if (await command('yum --version')) {
              await command(`yum install`)
            } else {

            }
            break
          default:
            throw new Not_supported('os', os_type)
        }
        break
    }
  }

  refresh() {}

  static async start_many(opts: T_opt_start[]) {
    for (let it of opts) {
      await this.start(it)
    }
  }

  static async start(opt: T_opt_start) {
    if (typeof opt === 'string') {
      opt = { type: opt }
    }

    if ( ! opt.os) {
      opt.os = await Os.from_current()
    }

    const ins = new this
    ins.os = opt.os
    ins.type = opt.type
    if (await ins.installed()) {
    } else {
      await ins.install()
    }
  }
}

export type T_opt_start =
  {
    os?: Os,
    type?: N_supported_web_server
  } | N_supported_web_server

