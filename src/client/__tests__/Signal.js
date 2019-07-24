const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { WebSocket, Server } = require('mock-socket')

global.WebSocket = WebSocket

chai.use(sinonChai)

const Signal = require('../Signal')

const decodeMessage = require('../../common/decodeMessage')
const MessageType = require('../../common/messageTypes')

describe('Signal', () => {

  const signalingUrl = 'ws://signaling:12345'
  let server
  let signal

  beforeEach(() => {
    server = new Server(signalingUrl)
    signal = new Signal(signalingUrl)
  })

  afterEach(() => {
    server.stop()
  })

  describe('openConnection', () => {

    it('connects to a signaling server and emits the Signal.OPEN event', done => {
      const openHandler = sinon.spy()

      signal.on(Signal.OPEN, openHandler)
      signal.on(Signal.OPEN, assertions)
      signal.openConnection()

      function assertions() {
        expect(openHandler).to.have.been.called
        expect(signal.socket).to.not.equal(null)
        expect(signal.isConnected).to.be.true
        done()
      }
    })

    it('emits the Signal.CLOSE event when connection is closed', done => {
      const closeHandler = sinon.spy()

      signal.on(Signal.CLOSE, closeHandler)
      signal.on(Signal.CLOSE, assertions)
      signal.openConnection()

      server.on('connection', client => client.close())

      function assertions() {
        expect(closeHandler).to.have.been.called
        expect(signal.socket).to.equal(null)
        expect(signal.isConnected).to.be.false
        done()
      }
    })

    it('emits the Signal.ERROR event when something wrong happen', done => {
      const errorHandler = sinon.spy()

      signal.on(Signal.ERROR, errorHandler)
      signal.on(Signal.ERROR, assertions)
      signal.openConnection()

      server.simulate('error')

      function assertions() {
        expect(errorHandler).to.have.been.called
        expect(signal.isConnected).to.be.false
        done()
      }
    })

    it('emits a custom event based on incoming message "type" property and pass the payload', done => {
      const messageHandler = sinon.spy()
      const message = '{ "type": "custom-event", "payload": [1, 2, 3] }'

      signal.on('custom-event', messageHandler)
      signal.on('custom-event', assertions)
      signal.openConnection()

      server.on('connection', client => client.send(message))

      function assertions() {
        expect(messageHandler).to.have.been.called
        expect(messageHandler).to.have.been.calledWith([1, 2, 3])
        done()
      }
    })

  })

  describe('Outbound messages', () => {

    it('connectAs', done => {
      const username = 'luke skywalker'

      server.on('connection', client => client.on('message', assertions))

      signal.on(Signal.OPEN, () => signal.connectAs(username))
      signal.openConnection()

      function assertions(rawMessage) {
        const { type, payload } = decodeMessage(rawMessage)
        expect(type).to.equal(MessageType.CONNECT)
        expect(payload).to.equal(username)
        done()
      }
    })

    it('requestCall', done => {
      const recipient = 'luke skywalker'

      server.on('connection', client => client.on('message', assertions))

      signal.on(Signal.OPEN, () => signal.requestCall(recipient))
      signal.openConnection()

      function assertions(rawMessage) {
        const { type, payload } = decodeMessage(rawMessage)
        expect(type).to.equal(MessageType.REQUEST_CALL)
        expect(payload).to.equal(recipient)
        done()
      }
    })

    it('acceptCall', done => {
      const caller = 'luke skywalker'

      server.on('connection', client => client.on('message', assertions))

      signal.on(Signal.OPEN, () => signal.acceptCall(caller))
      signal.openConnection()

      function assertions(rawMessage) {
        const { type, payload } = decodeMessage(rawMessage)
        expect(type).to.equal(MessageType.ACCEPT_CALL)
        expect(payload).to.equal(caller)
        done()
      }
    })

    it('rejectCall', done => {
      const caller = 'luke skywalker'

      server.on('connection', client => client.on('message', assertions))

      signal.on(Signal.OPEN, () => signal.rejectCall(caller))
      signal.openConnection()

      function assertions(rawMessage) {
        const { type, payload } = decodeMessage(rawMessage)
        expect(type).to.equal(MessageType.REJECT_CALL)
        expect(payload).to.equal(caller)
        done()
      }
    })

    it('sendCallerDescriptor', done => {
      const recipient = 'luke skywalker'
      const descriptor = 'sdp details'

      server.on('connection', client => client.on('message', assertions))

      signal.on(
        Signal.OPEN,
        () => signal.sendCallerDescriptor(recipient, descriptor)
      )
      signal.openConnection()

      function assertions(rawMessage) {
        const { type, payload } = decodeMessage(rawMessage)
        expect(type).to.equal(MessageType.SEND_CALLER_DESCRIPTOR)
        expect(payload.to).to.equal(recipient)
        expect(payload.sdp).to.equal(descriptor)
        done()
      }
    })

    it('sendRecipientDescriptor', done => {
      const caller = 'luke skywalker'
      const descriptor = 'sdp details'

      server.on('connection', client => client.on('message', assertions))

      signal.on(
        Signal.OPEN,
        () => signal.sendRecipientDescriptor(caller, descriptor)
      )
      signal.openConnection()

      function assertions(rawMessage) {
        const { type, payload } = decodeMessage(rawMessage)
        expect(type).to.equal(MessageType.SEND_RECIPIENT_DESCRIPTOR)
        expect(payload.to).to.equal(caller)
        expect(payload.sdp).to.equal(descriptor)
        done()
      }
    })

    it('sendICECandidate', done => {
      const recipient = 'luke skywalker'
      const candidate = 'ice candidate details'

      server.on('connection', client => client.on('message', assertions))

      signal.on(
        Signal.OPEN,
        () => signal.sendICECandidate(recipient, candidate)
      )
      signal.openConnection()

      function assertions(rawMessage) {
        const { type, payload } = decodeMessage(rawMessage)
        expect(type).to.equal(MessageType.SEND_ICE_CANDIDATE)
        expect(payload.to).to.equal(recipient)
        expect(payload.candidate).to.equal(candidate)
        done()
      }
    })

  })

})
