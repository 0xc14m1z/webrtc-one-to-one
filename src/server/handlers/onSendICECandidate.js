const Messages = require('../../common/messages')

function onSendICECandidate(client, { to, candidate }) {
  this.getClientByUsername(to)
      .send(Messages.iceCandidateReceived(client.username, candidate))
}

module.exports = onSendICECandidate
