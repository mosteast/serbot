import { EID_common } from '@mosteast/common_eid'
import { trim } from 'lodash'
import { E } from '@mosteast/e'
import { invalid_map } from './util/message'
import { T_object } from '../type'

export class Not_supported extends E {
  eid = EID_common.invalid_argument
  level = 'internal'

  constructor(type: string, value: string) {
    super()
    this.message = `${type} "${value}" is currently not supported, consider doing it manually.`
  }
}
