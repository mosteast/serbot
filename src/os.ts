import { command } from '@mosteast/command'
import { parse } from 'ini'
import {
  CpuInfo, NetworkInterfaceInfo, type, loadavg, hostname, uptime, freemem, totalmem, cpus, release, homedir,
  networkInterfaces,
} from 'os'
import { Component } from './component'
import { Not_supported } from './error/not_supported'

export enum N_supported_os {
  linux = 'linux'
}

export enum N_supported_release {
  centos = 'centos'
}

export class Os extends Component {
  hostname: string
  loadavg: number[]
  uptime: number
  freemem: number
  totalmem: number
  cpus: CpuInfo[]
  type: N_supported_os
  release_raw: string
  release: N_supported_release
  homedir: string
  networkInterfaces: { [index: string]: NetworkInterfaceInfo[] }

  async refresh() {
    this.hostname = hostname()
    this.type = <N_supported_os>type().toLocaleLowerCase()
    this.loadavg = loadavg()
    this.uptime = uptime()
    this.freemem = freemem()
    this.totalmem = totalmem()
    this.cpus = cpus()
    this.release_raw = release()
    this.homedir = homedir()
    this.networkInterfaces = networkInterfaces()
    this.release = await this.parse_release()
  }

  validate() {
    if ( ! [ 'Linux' ].includes(this.type)) {
      throw new Not_supported('os', this.type)
    }
  }

  async parse_release(): Promise<N_supported_release> {
    let r: N_supported_release

    switch (this.type) {
      case N_supported_os.linux:
        const os_release = parse((await command('cat /etc/os-release')).message)
        if (/centos/i.test(os_release.NAME)) {
          r = N_supported_release.centos
        }
        break
      default:
    }

    return r
  }

  update_all() {
    switch (this.type) {

    }
  }

  /**
   * From current os
   */
  static async from_current(): Promise<Os> {
    const ins = new this
    await ins.refresh()
    await ins.validate()
    return ins
  }
}
