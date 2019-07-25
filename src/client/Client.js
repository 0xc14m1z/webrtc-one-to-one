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
  setupSignal.call(this, url)
}

Client.OPEN = Signal.OPEN
Client.CLOSE = Signal.CLOSE
Client.ERROR = Signal.ERROR
Client.STREAM = 'STREAM'

function bubbleUp(event, payload) {
  this.emit(event, payload)
}

function setupSignal(url) {
  this.signal = new Signal(url)

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

  this.signal.on(MessageType.CALL_ACCEPTED, startCall.bind(this))
}

Client.prototype = Object.create(EventsEmitter.prototype)

Client.prototype.openConnection = function openConnection() {
  this.signal.openConnection()
}

Client.prototype.connectAs = function connectAs(username) {
  this.signal.connectAs(username)
}

Client.prototype.setLocalStream = function setLocalStream(stream) {
  this.stream = stream
}

Client.prototype.requestCall = function requestCall(to) {
  this.signal.requestCall(to)
}

Client.prototype.acceptCall = function acceptCall(from) {
  this.signal.acceptCall(from)
}

Client.prototype.rejectCall = function rejectCall(from) {
  this.signal.rejectCall(from)
}

function startCall(recipient) {
  setupRTCConnection.call(this, recipient)
  sendLocalDescriptor.call(this, recipient)
  this.emit(MessageType.CALL_ACCEPTED)
}

function setupRTCConnection(recipient) {
  this.connection = new RTCPeerConnection(this.options)
  this.connection.onicecandidate = onIceCandidate.bind(this, recipient)
  this.connection.ontrack = onRemoteTrack.bind(this)

  if ( this.stream )
    this.stream.getTracks()
               .forEach(track => this.connection.addTrack(track, this.stream))

  function onIceCandidate(recipient, event) {
    if ( event.candidate )
      this.signal.sendIceCandidate(recipient, event.candidate)
  }

  function onRemoteTrack(event) {
    this.emit(Client.STREAM, ...event.streams)
  }
}

function sendLocalDescriptor(recipient) {
  this.connection.createOffer()
                 .then(onOffer.bind(this))

  function onOffer(offer) {
    this.connection.setLocalDescription(offer)
                   .then(onLocalDescriptionSet.bind(this))
  }

  function onLocalDescriptionSet() {
    this.signal.sendLocalDescriptor(recipient, this.connection.localDescription)
  }
}

module.exports = Client
