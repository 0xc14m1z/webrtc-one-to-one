const expect = require('chai').expect

const encodeMessage = require('../../common/encodeMessage')
const decodeMessage = require('../../common/decodeMessage')

describe('Signal', () => {

  describe('on', () => {
    it('adds given handler to the event handlers array')
    it('append the given handler to the list for the given event')
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
