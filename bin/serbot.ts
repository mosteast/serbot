#!/usr/bin/env ts-node

import { N_supported_web_server, Server } from '../src/server'
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
          command: 'server <action> [types...]',
          describe: 'Web server level management',
          builder(argv) {
            return argv
              .positional('action', {
                describe: 'Server action name',
                choices: [ 'start', 'stop', 'restart' ],
              })
              .positional('type', {
                describe: 'Server type',
                type: 'array',
                default: [ N_supported_web_server.nginx ],
                choices: values(N_supported_web_server),
              })
              .options({
                // oa: {
                //   type: 'string',
                //   default: 'DEFAULT_VALUE',
                // },
              })
          },
          async handler(args) {
            await Server.start_many(args.type)
            console.log(args)
          },
        })
        .demandCommand()
    },
    handler() {},
  })
  .argv


