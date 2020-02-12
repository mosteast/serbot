#!/usr/bin/env ts-node

import { get_status } from '../src/status'
import { values } from 'lodash'
import { printer } from '@mosteast/print_helper'

export enum N_print_format {
  pretty = 'pretty',
  json   = 'json'
}

require('yargs')
  .command({
    command: '$0',
    describe: 'Serbot - Web server manager and deployer',
    builder(argv) {
      return argv
        .options({
          verbose: {
            describe: 'Verbose print',
            type: 'boolean',
          },
          format: {
            describe: 'Print format',
            default: N_print_format.pretty,
            choices: values(N_print_format),
            type: 'string',
          },
        })
        .command({
          command: 'brief',
          describe: 'Brief info of the machine and server',
          handler: async (args) => printer[args.format](await get_status({ brief: true })),
        })
        .command({
          command: 'status',
          describe: 'Full info of the machine and server',
          handler: async (args) => printer[args.format](await get_status()),
        })
        .command({
          command: 'os',
          describe: 'Machine level management',
        })
        .command({
          command: 'server',
          describe: 'Web server level management',
          builder(argv) {
            return argv
              .positional('a', {})
              .positional('b', {})
              .options({
                oa: {
                  type: 'string',
                  default: 'DEFAULT_VALUE',
                },
              })
          },
        })
        .demandCommand()
    },
    handler(args) {
      console.log(args)
    },
  })
  .argv


