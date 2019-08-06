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
Client.CONNECTED = MessageType.CONNECTED
Client.CLOSE = Signal.CLOSE
Client.ERROR = Signal.ERROR
Client.LOCAL_STREAM = 'LOCAL_STREAM'
Client.REMOTE_STREAM = 'REMOTE_STREAM'

const CALLER = 'CALLER'
const RECIPIENT = 'RECIPIENT'

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
  this.signal.on(MessageType.CALLER_DESCRIPTOR_RECEIVED, answerCall.bind(this))
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
  this.emit(Client.LOCAL_STREAM, this.stream)
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

  this.signal.on(
    MessageType.RECIPIENT_DESCRIPTOR_RECEIVED,
    onRemoteDescriptor.bind(this)
  )

  sendLocalDescriptor.call(this, CALLER, recipient)

  this.emit(MessageType.CALL_ACCEPTED)
}

function answerCall({ from: caller, sdp }) {
  setupRTCConnection.call(this, caller)
  onRemoteDescriptor.call(this, sdp)
  sendLocalDescriptor.call(this, RECIPIENT, caller)
}

function setupRTCConnection(recipient) {
  this.connection = new RTCPeerConnection(this.options)
  this.connection.onicecandidate = onIceCandidate.bind(this, recipient)
  this.connection.ontrack = onRemoteTrack.bind(this)

  if ( this.stream )
    this.stream.getTracks().forEach(addTrackToConnection.bind(this))

  this.signal.on(
    MessageType.ICE_CANDIDATE_RECEIVED,
    onIceCandidateReceived.bind(this)
  )

  function onIceCandidate(recipient, event) {
    if ( event.candidate )
      this.signal.sendIceCandidate(recipient, event.candidate)
  }

  function onRemoteTrack(event) {
    this.emit(Client.REMOTE_STREAM, ...event.streams)
  }

  function addTrackToConnection(track) {
    this.connection.addTrack(track, this.stream)
  }
}

function sendLocalDescriptor(as, to) {
  const descriptorFn = as === CALLER ? 'createOffer' : 'createAnswer'

  this.connection[descriptorFn]().then(onDescriptor.bind(this))

  function onDescriptor(descriptor) {
    this.connection.setLocalDescription(descriptor)
                   .then(onLocalDescriptionSet.bind(this))
  }

  function onLocalDescriptionSet() {
    const senderFn =
      as === CALLER ? 'sendCallerDescriptor' : 'sendRecipientDescriptor'

    this.signal[senderFn](to, this.connection.localDescription)
  }
}

function onRemoteDescriptor(descriptor) {
  this.connection.setRemoteDescription(new RTCSessionDescription(descriptor))
}

function onIceCandidateReceived(candidate) {
  this.connection.addIceCandidate(new RTCIceCandidate(candidate))
}

module.exports = Client
