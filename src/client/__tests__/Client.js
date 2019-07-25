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
    sinon.restore()
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
      expect(client.signal.handlers).to.include.all.keys(registeredEvents)
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

    it('sets events for calls-related messages', () => {
      expect(client.signal.handlers).to.include.all.keys(
        MessageType.CALL_ACCEPTED
      )
    })

  })

  describe('Outbound messages', () => {

    it('connectAs', () => {
      sinon.replace(client.signal, 'connectAs', sinon.spy())

      client.connectAs('luke skywalker')
      expect(client.signal.connectAs).to.have.been.called
    })

    it('setLocalStream', () => {
      client.setLocalStream('fake stream')
      expect(client.stream).to.equal('fake stream')
    })

    it('requestCall', () => {
      sinon.replace(client.signal, 'requestCall', sinon.spy())

      client.requestCall('luke skywalker')
      expect(client.signal.requestCall).to.have.been.called
    })

    it('acceptCall', () => {
      sinon.replace(client.signal, 'acceptCall', sinon.spy())

      client.acceptCall('luke skywalker')
      expect(client.signal.acceptCall).to.have.been.called
    })

    it('rejectCall', () => {
      sinon.replace(client.signal, 'rejectCall', sinon.spy())

      client.rejectCall('luke skywalker')
      expect(client.signal.rejectCall).to.have.been.called
    })

  })


})
