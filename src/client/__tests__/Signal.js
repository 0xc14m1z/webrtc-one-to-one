const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { WebSocket, Server } = require('mock-socket')

global.WebSocket = WebSocket

chai.use(sinonChai)

const Signal = require('../Signal')

describe('Signal', () => {

  let signal

  beforeEach(() => {
    signal = new Signal()
  })

  describe('on', () => {

    it('adds given handler to the event handlers array', () => {
      signal.on('event', () => {})
      expect(signal.handlers['event']).to.be.an('array')
      expect(signal.handlers['event']).to.have.lengthOf(1)
    })

    it('append the given handler to the list for the given event', () => {
      signal.on('event', () => {})
      signal.on('event', () => {})
      expect(signal.handlers['event']).to.have.lengthOf(2)
    })

  })

  describe('emit', () => {

    it('doesn\'t crash if emits an event without handlers', () => {
      const emission = () => signal.emit('inexistent-event', 1, 2, 3)
      expect(emission).to.not.throw()
    })

    it('calls event handler with given payload', () => {
      const handler = sinon.spy()
      signal.on('event', handler)

      signal.emit('event', 1, 2, 3)

      expect(handler).to.have.been.called
      expect(handler).to.have.been.calledWith(1, 2, 3)
    })

    it('call all the handlers for an event', () => {
      const firstHandler = sinon.spy()
      const secondHandler = sinon.spy()

      signal.on('event', firstHandler)
      signal.on('event', secondHandler)

      signal.emit('event')

      expect(firstHandler).to.have.been.called
      expect(secondHandler).to.have.been.called
    })

    it('skips non-function handlers', () => {
      const handler = 42
      signal.on('event', handler)

      const emission = () => signal.emit('event')
      expect(emission).to.not.throw()
    })

  })

  describe('openConnection', () => {

    const signalingUrl = 'ws://signaling:12345'
    let server

    beforeEach(() => {
      server = new Server(signalingUrl)
    })

    afterEach(() => {
      server.stop()
    })

    it('connects to a signaling server and emits the Signal.OPEN event', done => {
      const openHandler = sinon.spy()

      signal.on(Signal.OPEN, openHandler)
      signal.on(Signal.OPEN, assertions)
      signal.openConnection(signalingUrl)

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
      signal.openConnection(signalingUrl)

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
      signal.openConnection(signalingUrl)

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
      signal.openConnection(signalingUrl)

      server.on('connection', client => client.send(message))

      function assertions() {
        expect(messageHandler).to.have.been.called
        expect(messageHandler).to.have.been.calledWith([1, 2, 3])
        done()
      }
    })

  })

})
