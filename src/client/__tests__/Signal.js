const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { WebSocket, Server } = require('mock-socket')

global.WebSocket = WebSocket

chai.use(sinonChai)

const Signal = require('../Signal')

describe('Signal', () => {

  const signalingUrl = 'ws://signaling:12345'
  let signal

  beforeEach(() => {
    signal = new Signal(signalingUrl)
  })

  describe('openConnection', () => {
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

})
