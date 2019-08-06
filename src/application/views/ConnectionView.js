const MessageType = require('../../common/messageTypes')

function ConnectionView(application) {

  let $errorMessage
  let $form
  let $usernameInput
  let $connectButton
  let $connectionLoader

  application.client.on(MessageType.USERNAME_TAKEN, onUsernameTaken)

  render()
  setReferences()
  addEventsListeners()

  function render() {
    application.render(`
      <div id="connection" class="screen">
        <h1>Connect</h1>
        <div class="message error hidden">
          The username you choose has already been taken.
        </div>
        <form>
          <input
            type="text"
            name="username"
            placeholder="username"
            autocomplete="off"
          />
          <button disabled>
            Connect <span class="loader hidden"></span>
          </button>
        </form>
      </div>
    `)
  }

  function setReferences() {
    $errorMessage = document.querySelector('#connection .message')
    $form = document.querySelector('#connection form')
    $usernameInput = document.querySelector('#connection input')
    $connectButton = document.querySelector('#connection button')
    $connectionLoader = document.querySelector('#connection button .loader')
  }

  function addEventsListeners() {
    $form.addEventListener('submit', performLogin)
    $usernameInput.addEventListener('input', validateUsername)
    $connectButton.addEventListener('click', performLogin)
  }

  function performLogin(event) {
    event.preventDefault()

    $errorMessage.classList.add('hidden')
    $usernameInput.disabled = true
    $connectButton.disabled = true
    $connectionLoader.classList.remove('hidden')

    application.client.connectAs($usernameInput.value)
  }

  function validateUsername() {
    $connectButton.disabled = $usernameInput.value.trim() === ''
  }

  function onUsernameTaken() {
    $errorMessage.classList.remove('hidden')
    $usernameInput.disabled = false
    $usernameInput.focus()
    $connectButton.disabled = false
    $connectionLoader.classList.add('hidden')
  }
}

module.exports = ConnectionView
