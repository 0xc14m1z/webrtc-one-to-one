# chatroulette-assignment

## Workflow

- When the application starts, it shall presents a screen that allows the user
to pick a username and connect to the signaling server with it. The case where 
that username has already been picked must be handled; Alternatively, a 
token-like thing is automatically released at the connection.

  - If the connection fails for some reason, a proper message must be shown.

  - After a successfull connection to the signaling server, three things must be
  handled in this "idle" state:

    - The connection get closed by the server, so the user should be notified
    and pushed back to the entry point with a proper error message.
  
    - The user shall be presented with a screen where someone else's username 
    (or token) can be typed and a call request sent.

      - After a call request is sent, the user shall see an answer-waiting state

    - A call request arrives from another user.


- When a call request is sent, the user shall see an answer-waiting state where:

  - the recipient can respond negatively, so an information message shall be 
  shown to the user and the call request canceled

  - a positive answer can come back:

    - the user shall be presented with a "call" view with the recipient video
    in a "waiting" state

    - the RTCConnection shall be created

    - the media shall be requested

    - session descriptors and ice candidates must be exchanged so that the
    actual audio/video transmission can start


- When a call request is received:

  - the user shall be presented with something that allows to accept or reject
  the call:

    - when the call is rejected, nothing happens, the user keep being in the
    "idle" state

    - when the call is accepted:

      - the user shall be presented with a "call" view with the caller video
    in a "waiting" state

    - the RTCConnection shall be created

    - the media shall be requested

    - session descriptors and ice candidates must be exchanged so that the
    actual audio/video transmission can start


## Protocol

```

CALLER                           SIGNALING                          RECIPIENT

CONNECT ----------------------->
{ as }

REQUEST_CALL ------------------> CALL_REQUESTED ------------------>
{ to }                           { from }

       <------------------------ CALL_ACCEPTED <------------------- ACCEPT_CALL
                                 { by }                             { from }

       <------------------------ CALL_REJECTED <------------------- REJECT_CALL
                                 { by }                             { from }

SEND_CALLER_DESCRIPTOR --------> CALLER_DESCRIPTOR_RECEIVED ------>
{ to, sdp }                      { from, sdp }

       <------------------------ RECIPIENT_DESCRIPTOR_RECEIVED <--- SEND_RECIPIENT_DESCRIPTOR
                                 { from, sdp }                      { to, sdp }

SEND_ICE_CANDIDATE ------------> ICE_CANDIDATE_RECEIVED ---------->
{ to, candidate }                { from, candidate }

       <------------------------ ICE_CANDIDATE_RECEIVED <----------- SEND_ICE_CANDIDATE
                                 { from, candidate }                 { to, candidate }

```