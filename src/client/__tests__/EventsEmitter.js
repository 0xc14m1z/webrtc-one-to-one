const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

const EventsEmitter = require('../EventsEmitter')

describe('EventsEmitter', () => {

  let emitter

  beforeEach(() => {
    emitter = new EventsEmitter()
  })

  describe('on', () => {

    it('adds given handler to the event handlers array', () => {
      emitter.on('event', () => {})
      expect(emitter.handlers['event']).to.be.an('array')
      expect(emitter.handlers['event']).to.have.lengthOf(1)
    })

    it('append the given handler to the list for the given event', () => {
      emitter.on('event', () => {})
      emitter.on('event', () => {})
      expect(emitter.handlers['event']).to.have.lengthOf(2)
    })

  })

  describe('emit', () => {

    it('doesn\'t crash if emits an event without handlers', () => {
      const emission = () => emitter.emit('inexistent-event', 1, 2, 3)
      expect(emission).to.not.throw()
    })

    it('calls event handler with given payload', () => {
      const handler = sinon.spy()
      emitter.on('event', handler)

      emitter.emit('event', 1, 2, 3)

      expect(handler).to.have.been.called
      expect(handler).to.have.been.calledWith(1, 2, 3)
    })

    it('call all the handlers for an event', () => {
      const firstHandler = sinon.spy()
      const secondHandler = sinon.spy()

      emitter.on('event', firstHandler)
      emitter.on('event', secondHandler)

      emitter.emit('event')

      expect(firstHandler).to.have.been.called
      expect(secondHandler).to.have.been.called
    })

    it('skips non-function handlers', () => {
      const handler = 42
      emitter.on('event', handler)

      const emission = () => emitter.emit('event')
      expect(emission).to.not.throw()
    })

  })

})
