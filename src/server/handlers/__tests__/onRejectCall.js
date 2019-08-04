const expect = require('chai').expect

const Messages = require('../../../common/messages')
const onRejectCall = require('../onRejectCall')

describe('onRejectCall', () => {

  const caller = 'luke skywalker'
  const receiver = 'princess leia'

  it('sends a CALL_REJECTED message to the caller', done => {
    const socket = {
            getClientByUsername: username => ({
              send: message => {
                expect(message).to.equal(Messages.callRejected(receiver))
                done()
              }
            })
          },
          client = {
            username: receiver
          }

    onRejectCall.call(socket, client, caller)
  })

})
