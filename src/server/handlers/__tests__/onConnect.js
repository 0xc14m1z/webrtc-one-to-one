const expect = require('chai').expect

const Messages = require('../../../common/messages')
const onConnect = require('../onConnect')

describe('onConnect', () => {

  const username = 'luke skywalker'

  it('allow a client to connect with a username', () => {
    const socket = { isUsernameAvailable: () => true },
          client = {
            send: message =>
              expect(message).to.equal(Messages.connected())
          }

    onConnect.call(socket, client, username)
    expect(client.username).to.equal(username)
  })

  it('prevent a client to connect if the username has been already used', () => {
    const socket = { isUsernameAvailable: () => false },
          client = {
            send: message =>
              expect(message).to.equal(Messages.usernameTaken())
          }

    onConnect.call(socket, client, username)
  })

})
