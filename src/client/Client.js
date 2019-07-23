const EventsEmitter = require('./EventsEmitter')
const Signal = require('./Signal')

const MessageType = require('../common/messageTypes')

const defaultOptions = {
  iceServers: [{
    urls: ['stun:stun.l.google.com:19302']
  }]
}

function Client(url, options) {
  EventsEmitter.call(this)

  this.options = options || defaultOptions

  this.connection = null
  this.stream = null

  this.signal = null
  setupSignal.call(this)
  this.signal.openConnection(url)
}

Client.STREAM = 'STREAM'

function bubbleUp(event, payload) {
  this.emit(event, payload)
}

function setupSignal() {
  this.signal = new Signal()

  const eventsToBubble = [
    Signal.OPEN,
    Signal.CLOSE,
    Signal.ERROR,

    MessageType.USERNAME_TAKEN,
    MessageType.CONNECTED,

    MessageType.UNKNOWN_RECIPIENT,
    MessageType.CALL_REQUESTED,
    MessageType.CALL_REJECTED
  ]

  eventsToBubble.forEach(
    event => this.signal.on(event, bubbleUp.bind(this, event))
  )
}

Client.prototype = Object.create(EventsEmitter.prototype)

module.exports = Client
