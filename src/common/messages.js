const MessageType = require('./messageTypes')
const encodeMessage = require('./encodeMessage')

function connectAs(username) {
  return encodeMessage(MessageType.CONNECT, username)
}

function usernameTaken() {
  return encodeMessage(MessageType.USERNAME_TAKEN)
}

function connected() {
  return encodeMessage(MessageType.CONNECTED)
}

function requestCall(to) {
  return encodeMessage(MessageType.REQUEST_CALL, to)
}

function acceptCall(from) {
  return encodeMessage(MessageType.ACCEPT_CALL, from)
}

function rejectCall(from) {
  return encodeMessage(MessageType.REJECT_CALL, from)
}

function sendCallerDescriptor(to, sdp) {
  return encodeMessage(MessageType.SEND_CALLER_DESCRIPTOR, { to, sdp })
}

function sendRecipientDescriptor(to, sdp) {
  return encodeMessage(MessageType.SEND_RECIPIENT_DESCRIPTOR, { to, sdp })
}

function sendICECandidate(to, candidate) {
  return encodeMessage(MessageType.SEND_ICE_CANDIDATE, { to, candidate })
}

module.exports = {
  connectAs,
  usernameTaken,
  connected,
  requestCall,
  acceptCall,
  rejectCall,
  sendCallerDescriptor,
  sendRecipientDescriptor,
  sendICECandidate
}
