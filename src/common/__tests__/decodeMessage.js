const expect = require('chai').expect

const decodeMessage = require('../decodeMessage')

describe('decodeMessage', () => {

  it('returns an object parsing a valid JSON string', () => {
    const rawMessage = { name: 'luke', surname: 'skywalker' },
          encodedMessage = JSON.stringify(rawMessage),
          decodedMessage = decodeMessage(encodedMessage)

    expect(decodedMessage).to.be.an('object')
    expect(decodedMessage).to.have.all.keys('name', 'surname')
    expect(decodedMessage.name).to.equal('luke')
    expect(decodedMessage.surname).to.equal('skywalker')
  })

  it('returns an empty object if the given message is an invalid JSON string', () => {
    const rawMessage = 'luke skywalker',
          decodedMessage = decodeMessage(rawMessage)

    expect(decodedMessage).to.be.an('object')
    expect(Object.keys(decodedMessage)).to.have.lengthOf(0)
  })

})
