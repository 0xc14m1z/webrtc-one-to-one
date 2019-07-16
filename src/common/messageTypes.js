// short message types are used to reduce bytes sent around
module.exports = {

  CONNECT: 'c',
  USERNAME_TAKEN: 'ut',
  CONNECTED: 'cd',

  REQUEST_CALL: 'rc',
  UNKNOWN_RECIPIENT: 'ur',
  CALL_REQUESTED: 'cr',

  ACCEPT_CALL: 'ac',
  CALL_ACCEPTED: 'ca',

  REJECT_CALL: 'rjc',
  CALL_REJECTED: 'crj',

  SEND_CALLER_DESCRIPTOR: 'scd',
  CALLER_DESCRIPTOR_RECEIVED: 'cdr',

  SEND_RECIPIENT_DESCRIPTOR: 'srd',
  RECIPIENT_DESCRIPTOR_RECEIVED: 'rdr',

  SEND_ICE_CANDIDATE: 'sic',
  ICE_CANDIDATE_RECEIVED: 'icr'

}
