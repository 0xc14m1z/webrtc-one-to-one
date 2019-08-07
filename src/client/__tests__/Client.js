const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { WebSocket, Server } = require('mock-socket')
const Mocks = require('../mocks')
const rewire = require('rewire')

global.WebSocket = WebSocket
global.RTCPeerConnection = Mocks.RTCPeerConnection
global.MediaStream = Mocks.MediaStream
global.RTCSessionDescription = Mocks.RTCSessionDescription
global.RTCIceCandidate = Mocks.RTCIceCandidate

chai.use(sinonChai)

const Signal = require('../Signal')
const Client = rewire('../Client')
const MessageType = require('../../common/messageTypes')
const decodeMessage = require('../../common/decodeMessage')

describe('Client', () => {

  const signalingUrl = 'ws://signaling:12345'
  let client
  let server

  const caller = 'luke skywalker'
  const recipient = 'princess leia'

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

  describe('openConnection', () => {

    it('calls the openConnection method on the signal', () => {
      sinon.replace(client.signal, 'openConnection', sinon.spy())
      client.openConnection()

      expect(client.signal.openConnection).to.have.been.called
    })

  })

  describe('Private methods', () => {

    describe('startCall', () => {

      it('gets called when CALL_ACCEPTED event is emitted', () => {
        const startCall = sinon.spy()

        // startCall cannot be replaced from outside because it's bound,
        // thus a new bound function is returned on the fly
        client.signal.handlers[MessageType.CALL_ACCEPTED][0] = startCall
        client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

        expect(startCall).to.have.been.called
        expect(startCall).to.have.been.calledWith(recipient)
      })

      it('sets up the RTCPeerConnection object', done => {
        const revert = Client.__set__('setupRTCConnection', function (receiver) {
          revert()

          expect(receiver).to.equal(recipient)

          done()
        })

        client.signal.emit(MessageType.CALL_ACCEPTED, recipient)
      })

      it('adds a listener for the RECIPIENT_DESCRIPTOR_RECEIVED message', () => {
        const message = MessageType.RECIPIENT_DESCRIPTOR_RECEIVED

        expect(client.signal.handlers[message]).to.be.undefined

        client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

        expect(client.signal.handlers[message]).to.be.an('array')
        expect(client.signal.handlers[message]).to.have.lengthOf(1)
      })

      it('generates and sends the local session descriptor', () => {
        client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

        expect(client.connection.createOffer).to.have.been.called
      })

      it('bubbles up the CALL_ACCEPTED event', done => {
        const handler = sinon.spy()

        client.on(MessageType.CALL_ACCEPTED, handler)
        client.on(MessageType.CALL_ACCEPTED, assertions)
        client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

        function assertions() {
          expect(handler).to.have.been.called
          done()
        }
      })

    })

    describe('setupRTCConnection', () => {

      it('instantiates the RTCPeerConnection object', done => {
        client.on(MessageType.CALL_ACCEPTED, assertions)
        client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

        function assertions() {
          expect(client.connection).not.to.be.null
          expect(client.connection.onicecandidate).to.be.a('function')
          expect(client.connection.ontrack).to.be.a('function')
          done()
        }
      })

      it('doesn\'t adds local stream tracks to the connection if it isn\'t present', done => {
        client.localStream = null

        client.on(MessageType.CALL_ACCEPTED, assertions)
        client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

        function assertions() {
          expect(Mocks.RTCPeerConnection.addTrack).to.not.have.been.called
          done()
        }
      })

      it('adds the local stream tracks to the connection if it is present', done => {
        client.localStream = {
          getTracks() {
            return ['track 1', 'track 2']
          }
        }

        client.on(MessageType.CALL_ACCEPTED, assertions)
        client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

        function assertions() {
          expect(Mocks.RTCPeerConnection.addTrack).to.have.been.called
          expect(Mocks.RTCPeerConnection.addTrack).to.have.been.calledTwice
          done()
        }
      })

      it('adds a listener for the ICE_CANDIDATE_RECEIVED message', () => {
        const message = MessageType.ICE_CANDIDATE_RECEIVED

        expect(client.signal.handlers[message]).to.be.undefined

        client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

        expect(client.signal.handlers[message]).to.be.an('array')
        expect(client.signal.handlers[message]).to.have.lengthOf(1)
      })

      describe('onIceCandidate', () => {

        it('sends an ice candidate to the other peer if it is provided', () => {
          sinon.replace(client.signal, 'sendICECandidate', sinon.spy())

          client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

          const event = { candidate: 'fake ice candidate' }
          client.connection.onicecandidate(event)

          expect(client.signal.sendICECandidate).to.have.been.called
        })

        it('doesn\'t send an ice candidate to the other peer if it isn\'t provided', () => {
          sinon.replace(client.signal, 'sendICECandidate', sinon.spy())

          client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

          const event = {}
          client.connection.onicecandidate(event)

          expect(client.signal.sendICECandidate).to.not.have.been.called
        })

      })

      describe('onRemoteTrack', () => {

        it('creates a remote MediaStream if not present', () => {
          client.remoteStream = null
          client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

          const event = {}
          client.connection.ontrack(event)

          expect(client.remoteStream).not.to.be.null
        })

        it('doesn\'t replace a MediaStream if it is already present', () => {
          client.remoteStream = 'fake remote stream'
          client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

          const event = {}
          client.connection.ontrack(event)

          expect(client.remoteStream).to.equal('fake remote stream')
        })

        it('adds the track to the remoteStream if present', () => {
          client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

          const event = { track: 'fake track' }
          client.connection.ontrack(event)

          expect(client.remoteStream.addTrack).to.have.been.called
        })

        it('emits the REMOTE_STREAM event', done => {
          const handler = sinon.spy()

          client.on(Client.REMOTE_STREAM, handler)
          client.on(Client.REMOTE_STREAM, assertions)

          client.signal.emit(MessageType.CALL_ACCEPTED, recipient)

          const event = { track: 'fake track' }
          client.connection.ontrack(event)

          function assertions() {
            expect(handler).to.have.been.called
            done()
          }
        })

      })

    })

    describe('answerCall', () => {

      it('gets called when CALLER_DESCRIPTOR_RECEIVED event is emitted', () => {
        const answerCall = sinon.spy(),
              message = MessageType.CALLER_DESCRIPTOR_RECEIVED,
              event = {
                from: caller,
                sdp: 'fake session descriptor'
              }

        client.signal.handlers[message][0] = answerCall
        client.signal.emit(message, event)

        expect(answerCall).to.have.been.called
        expect(answerCall).to.have.been.calledWith(event)
      })

      it('sets up the RTCPeerConnection object', done => {
        const event = {
          from: caller,
          sdp: 'fake session descriptor'
        }

        const revert = Client.__set__('setupRTCConnection', function (callee) {
          revert()

          expect(callee).to.equal(caller)

          done()
        })

        client.signal.emit(MessageType.CALLER_DESCRIPTOR_RECEIVED, event)
      })

      it('generates and sends the local session descriptor', () => {
        const event = {
          from: caller,
          sdp: 'fake session descriptor'
        }

        client.signal.emit(MessageType.CALLER_DESCRIPTOR_RECEIVED, event)

        expect(client.connection.createAnswer).to.have.been.called
      })

    })

    describe('onIceCandidateReceived', () => {

      it('adds an RTCIceCandidate to the connection', () => {
        client.signal.emit(MessageType.CALL_ACCEPTED, recipient)
        sinon.replace(client.connection, 'addIceCandidate', sinon.spy())

        client.signal.emit(MessageType.ICE_CANDIDATE_RECEIVED, {})

        expect(client.connection.addIceCandidate).to.have.been.called
      })

    })

  })

  describe('Outbound messages', () => {

    it('connectAs', () => {
      sinon.replace(client.signal, 'connectAs', sinon.spy())

      client.connectAs(caller)
      expect(client.signal.connectAs).to.have.been.called
    })

    it('setLocalStream', () => {
      client.setLocalStream('fake stream')
      expect(client.localStream).to.equal('fake stream')
    })

    it('requestCall', () => {
      sinon.replace(client.signal, 'requestCall', sinon.spy())

      client.requestCall(caller)
      expect(client.signal.requestCall).to.have.been.called
    })

    it('acceptCall', () => {
      sinon.replace(client.signal, 'acceptCall', sinon.spy())

      client.acceptCall(caller)
      expect(client.signal.acceptCall).to.have.been.called
    })

    it('rejectCall', () => {
      sinon.replace(client.signal, 'rejectCall', sinon.spy())

      client.rejectCall(caller)
      expect(client.signal.rejectCall).to.have.been.called
    })

  })

})
