const expect = require('chai').expect

const Messages = require('../../../common/messages')
const onRejectCall = require('../onRejectCall')

describe('onRejectCall', () => {

  const caller = 'luke skywalker'
  const recipient = 'princess leia'

  it('sends a CALL_REJECTED message to the caller', done => {
    const socket = {
            getClientByUsername: () => ({
              send: message => {
                expect(message).to.equal(Messages.callRejected(recipient))
                done()
              }
            })
          },
          client = {
            username: recipient
          }

    onRejectCall.call(socket, client, caller)
  })

})
