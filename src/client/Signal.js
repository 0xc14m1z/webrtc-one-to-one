const decodeMessage = require('../common/decodeMessage')
const Messages = require('../common/messages')

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

Signal.prototype.send = function send(rawMessage) {
  if ( this.socket && this.socket.readyState === WebSocket.OPEN )
    this.socket.send(rawMessage)
}

Signal.prototype.connectAs = function connectAs(username) {
  this.send(Messages.connectAs(username))
}

Signal.prototype.requestCall = function requestCall(to) {
  this.send(Messages.requestCall(to))
}

Signal.prototype.acceptCall = function acceptCall(from) {
  this.send(Messages.acceptCall(from))
}

Signal.prototype.rejectCall = function rejectCall(from) {
  this.send(Messages.rejectCall(from))
}

Signal.prototype.sendCallerDescriptor = function sendCallerDescriptor(to, sdp) {
  this.send(Messages.sendCallerDescriptor(to, sdp))
}

Signal.prototype.sendRecipientDescriptor = function sendRecipientDescriptor(to, sdp) {
  this.send(Messages.sendRecipientDescriptor(to, sdp))
}

Signal.prototype.sendICECandidate = function sendICECandidate(to, candidate) {
  this.send(Messages.sendICECandidate(to, candidate))
}

module.exports = Signal
