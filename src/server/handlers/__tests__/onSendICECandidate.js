const expect = require('chai').expect

const Messages = require('../../../common/messages')
const onSendICECandidate = require('../onSendICECandidate')

describe('onSendICECandidate', () => {

  const caller = 'luke skywalker'
  const recipient = 'princess leia'
  const candidate = 'ice candidate server'

  it('sends a ICE_CANDIDATE_RECEIVED message to the recipient', done => {
    const socket = {
            getClientByUsername: () => ({
              send: message => {
                expect(message).to.equal(
                  Messages.iceCandidateReceived(caller, candidate)
                )
                done()
              }
            })
          },
          client = {
            username: caller
          },
          payload = {
            to: recipient,
            candidate
          }

    onSendICECandidate.call(socket, client, payload)
  })

})
