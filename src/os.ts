import {
  CpuInfo, NetworkInterfaceInfo, type, loadavg, hostname, uptime, freemem, totalmem, cpus, release, homedir,
  networkInterfaces,
} from 'os'

export class Os {
  hostname: string
  loadavg: number[]
  uptime: number
  freemem: number
  totalmem: number
  cpus: CpuInfo[]
  type: string
  release: string
  homedir: string
  networkInterfaces: { [index: string]: NetworkInterfaceInfo[] }

  refresh() {
    this.hostname = hostname()
    this.loadavg = loadavg()
    this.uptime = uptime()
    this.freemem = freemem()
    this.totalmem = totalmem()
    this.cpus = cpus()
    this.type = type()
    this.release = release()
    this.homedir = homedir()
    this.networkInterfaces = networkInterfaces()
  }

  /**
   * From current os
   */
  static async from_current(): Promise<Os> {
    const ins = new this
    ins.refresh()
    return ins
  }
}
