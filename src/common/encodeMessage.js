function encodeMessage(type, payload) {
  return JSON.stringify({ type, payload })
}

module.exports = encodeMessage