const onConnect = require('./onConnect')
const onRequestCall = require('./onRequestCall')
const onAcceptCall = require('./onAcceptCall')
const onRejectCall = require('./onRejectCall')
const onSendCallerDescriptor = require('./onSendCallerDescriptor')

module.exports = {
  onConnect,
  onRequestCall,
  onAcceptCall,
  onRejectCall,
  onSendCallerDescriptor
}
