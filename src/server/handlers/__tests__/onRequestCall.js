const expect = require('chai').expect

const Messages = require('../../../common/messages')
const onRequestCall = require('../onRequestCall')

describe('onRequestCall', () => {

  const caller = 'luke skywalker'
  const recipient = 'princess leia'

  it('sends a CALL_REQUESTED message to the recipient', done => {
    const socket = {
            isUsernameAvailable: () => false,
            getClientByUsername: () => ({
              send: message => {
                expect(message).to.equal(Messages.callRequested(caller))
                done()
              }
            })
          },
          client = {
            username: caller
          }

    onRequestCall.call(socket, client, recipient)
  })

  it('reply with UNKNOWN_RECIPIENT if the recipient isn\'t in the clients list', () => {
    const socket = { isUsernameAvailable: () => true },
          client = {
            send: message =>
              expect(message).to.equal(Messages.unknownRecipient())
          }

    onRequestCall.call(socket, client, recipient)
  })

})
