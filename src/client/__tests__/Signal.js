const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

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
      expect(signal.eventHandlers['event']).to.be.an('array')
      expect(signal.eventHandlers['event']).to.have.lengthOf(1)
    })

    it('append the given handler to the list for the given event', () => {
      signal.on('event', () => {})
      signal.on('event', () => {})
      expect(signal.eventHandlers['event']).to.have.lengthOf(2)
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

  })

  describe('openConnection', () => {
    it('connects to an existing signaling server')
    it('throws an error whether the signaling server doesn\'t exist')
  })

})
