const expect = require('chai').expect
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
    it('doesn\'t crash if emits an event without handlers')
    it('call all the handlers for an event')
    it('pass the given payload')
  })

  describe('openConnection', () => {
    it('connects to an existing signaling server')
    it('throws an error whether the signaling server doesn\'t exist')
  })

})
