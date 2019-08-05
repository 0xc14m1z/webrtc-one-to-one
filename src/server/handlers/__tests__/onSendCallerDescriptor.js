const expect = require('chai').expect

const Messages = require('../../../common/messages')
const onSendCallerDescriptor = require('../onSendCallerDescriptor')

describe('onSendCallerDescriptor', () => {

  const caller = 'luke skywalker'
  const receiver = 'princess leia'
  const descriptor = 'session descriptor'

  it('sends a CALLER_DESCRIPTOR_RECEIVED message to the recipient', done => {
    const socket = {
            getClientByUsername: () => ({
              send: message => {
                expect(message).to.equal(
                  Messages.callerDescriptorReceived(caller, descriptor)
                )
                done()
              }
            })
          },
          client = {
            username: caller
          },
          payload = {
            to: receiver,
            sdp: descriptor
          }

    onSendCallerDescriptor.call(socket, client, payload)
  })

})
