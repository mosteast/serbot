import * as events from 'events'

export abstract class Component extends events.EventEmitter {
  abstract refresh()
}
