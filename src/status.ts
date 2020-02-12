import { freemem } from 'os'
import { Os } from './os'
import { pick } from 'lodash'

export interface T_status {
  os?: Partial<Os> | Os
}

export interface T_opt_get_status {
  brief?: boolean
}

export async function get_status(opt?: T_opt_get_status): Promise<T_status> {
  const { brief } = { brief: false, ...opt }

  const os = await Os.from_current()
  const r: T_status = {}

  if (brief) {
    return {
      os: pick<Os>(os, [ 'hostname', 'uptime', 'freemem', 'totalmem', 'type', 'homedir' ]),
    }
  } else {
    return { os }
  }
}

