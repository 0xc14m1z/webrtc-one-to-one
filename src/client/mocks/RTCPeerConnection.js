const sinon = require('sinon')

function RTCPeerConnection() {
  return {
    onicecandidate: RTCPeerConnection.onicecandidate,
    ontrack: RTCPeerConnection.ontrack,
    addTrack: RTCPeerConnection.addTrack,
    setLocalDescription: RTCPeerConnection.setLocalDescription,
    setRemoteDescription: RTCPeerConnection.setRemoteDescription,
    localDescription: RTCPeerConnection.localDescription,
    addIceCandidate: RTCPeerConnection.addIceCandidate,
    createOffer: RTCPeerConnection.createOffer,
    createAnswer: RTCPeerConnection.createAnswer
  }
}

RTCPeerConnection.icecandidate = sinon.spy()
RTCPeerConnection.track = sinon.spy()
RTCPeerConnection.addTrack = sinon.spy()
RTCPeerConnection.setLocalDescription = sinon.stub().resolves()
RTCPeerConnection.setRemoteDescription = sinon.stub().resolves()
RTCPeerConnection.localDescription = sinon.spy()
RTCPeerConnection.addIceCandidate = sinon.spy()
RTCPeerConnection.createOffer = sinon.stub().resolves()
RTCPeerConnection.createAnswer = sinon.stub().resolves()

module.exports = RTCPeerConnection
