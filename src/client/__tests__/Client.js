const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { WebSocket, Server } = require('mock-socket')

global.WebSocket = WebSocket

chai.use(sinonChai)

const Signal = require('../Signal')
const Client = require('../Client')
const MessageType = require('../../common/messageTypes')
const decodeMessage = require('../../common/decodeMessage')

describe('Client', () => {

  const signalingUrl = 'ws://signaling:12345'
  let client
  let server

  beforeEach(() => {
    server = new Server(signalingUrl)
    client = new Client(signalingUrl)
  })

  afterEach(() => {
    server.stop()
  })

  describe('constructor', () => {

    it('initialize the events emitter', () => {
      expect(client.handlers).to.be.an('object')
    })

    it('sets custom options if provided', () => {
      const defaultOptions = {
        iceServers: [{
          urls: ['stun:stun.l.google.com:19302']
        }]
      }

      expect(client.options).to.deep.equal(defaultOptions)

      client = new Client(signalingUrl, 'fake custom options')
      expect(client.options).to.deep.equal('fake custom options')
    })

    it('initialize the signaling object', () => {
      expect(client.signal).to.be.an.instanceof(Signal)

      const registeredEvents = [
        Signal.OPEN,
        Signal.CLOSE,
        Signal.ERROR,

        MessageType.USERNAME_TAKEN,
        MessageType.CONNECTED,

        MessageType.UNKNOWN_RECIPIENT,
        MessageType.CALL_REQUESTED,
        MessageType.CALL_REJECTED
      ]
      expect(client.signal.handlers).to.have.keys(registeredEvents)
    })

    it('sets events that bubbles up', () => {
      const handler = sinon.spy()

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

      // add event handlers to the client
      eventsToBubble.forEach(event => client.on(event, handler))

      // manually emits events from the signal object
      eventsToBubble.forEach(event => client.signal.emit(event))

      expect(handler.callCount).to.equal(eventsToBubble.length)
    })

  })

  describe('Outbound messages', () => {

    it('connectAs')

    it('setLocalStream')

    it('requestCall')

    it('acceptCall')

    it('rejectCall')

  })


})
