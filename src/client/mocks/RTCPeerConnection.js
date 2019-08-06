function noOp() {}
function promiseNoOp() { return Promise.resolve() }

function RTCPeerConnection() {
  return {
    onicecandidate: noOp,
    ontrack: noOp,
    addTrack: noOp,
    setLocalDescription: promiseNoOp,
    setRemoteDescription: promiseNoOp,
    localDescription: null,
    addIceCandidate: noOp,
    createOffer: promiseNoOp,
    createAnswer: promiseNoOp
  }
}

module.exports = RTCPeerConnection
