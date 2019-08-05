const expect = require('chai').expect

const Messages = require('../../../common/messages')
const onAcceptCall = require('../onAcceptCall')

describe('onAcceptCall', () => {

  const caller = 'luke skywalker'
  const receiver = 'princess leia'

  it('sends a CALL_ACCEPTED message to the caller', done => {
    const socket = {
            getClientByUsername: () => ({
              send: message => {
                expect(message).to.equal(Messages.callAccepted(receiver))
                done()
              }
            })
          },
          client = {
            username: receiver
          }

    onAcceptCall.call(socket, client, caller)
  })

})
