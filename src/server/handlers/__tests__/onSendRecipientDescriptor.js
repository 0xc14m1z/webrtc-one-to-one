const expect = require('chai').expect

const Messages = require('../../../common/messages')
const onSendRecipientDescriptor = require('../onSendRecipientDescriptor')

describe('onSendRecipientDescriptor', () => {

  const caller = 'luke skywalker'
  const recipient = 'princess leia'
  const descriptor = 'session descriptor'

  it('sends a RECIPIENT_DESCRIPTOR_RECEIVED message to the caller', done => {
    const socket = {
            getClientByUsername: () => ({
              send: message => {
                expect(message).to.equal(
                  Messages.recipientDescriptorReceived(recipient, descriptor)
                )
                done()
              }
            })
          },
          client = {
            username: recipient
          },
          payload = {
            to: caller,
            sdp: descriptor
          }

    onSendRecipientDescriptor.call(socket, client, payload)
  })

})
