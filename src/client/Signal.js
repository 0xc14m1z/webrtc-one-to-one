const decodeMessage = require('../common/decodeMessage')

const Socket = {
  OPEN: 'open',
  CLOSE: 'close',
  ERROR: 'error',
  MESSAGE: 'message'
}

function Signal() {
  this.socket = null
  this.isConnected = false
  this.eventHandlers = {}
}

Signal.OPEN = 'OPEN'
Signal.CLOSE = 'CLOSE'
Signal.ERROR = 'ERROR'

Signal.prototype.on = function on(event, handler) {
  if ( !this.eventHandlers[event] ) this.eventHandlers[event] = []
  this.eventHandlers[event].push(handler)
}

Signal.prototype.emit = function emit(event, ...payload) {
  const handlers = this.eventHandlers[event] || []
  handlers.forEach(function run(handler) {
    if ( typeof handler === 'function' ) handler.call(this, ...payload)
  })
}

Signal.prototype.openConnection = function openConnection(url) {
  this.socket = new WebSocket(url)

  function onOpen() {
    this.isConnected = true
    this.emit(Signal.OPEN)
  }

  function onClose() {
    this.socket = null
    this.isConnected = false
    this.emit(Signal.CLOSE)
  }

  function onError(error) {
    this.isConnected = false
    this.emit(Signal.ERROR)
  }

  function onMessage(rawMessage) {
    const { type, payload } = decodeMessage(rawMessage.data)
    this.emit(type, payload)
  }

  this.socket.addEventListener(Socket.OPEN, onOpen.bind(this))
  this.socket.addEventListener(Socket.CLOSE, onClose.bind(this))
  this.socket.addEventListener(Socket.ERROR, onError.bind(this))
  this.socket.addEventListener(Socket.MESSAGE, onMessage.bind(this))
}

module.exports = Signal
