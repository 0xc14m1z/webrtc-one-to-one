# chatroulette-assignment

## Protocol

```

CALLER                           SIGNALING SERVER                        RECIPIENT
--------------------------------------------------------------------------------------------------

CONNECT ----------------------->
{ as }

       <------------------------ USERNAME_TAKEN

       <------------------------ CONNECTED

REQUEST_CALL ------------------> CALL_REQUESTED ----------------------->
{ to }                           { from }

       <------------------------ UNKNOWN_RECIPIENT

       <------------------------ CALL_ACCEPTED <------------------------ ACCEPT_CALL
                                 { by }                                  { from }

       <------------------------ CALL_REJECTED <------------------------ REJECT_CALL
                                 { by }                                  { from }

SEND_CALLER_DESCRIPTOR --------> CALLER_DESCRIPTOR_RECEIVED ----------->
{ to, sdp }                      { from, sdp }

       <------------------------ RECIPIENT_DESCRIPTOR_RECEIVED <-------- SEND_RECIPIENT_DESCRIPTOR
                                 { from, sdp }                           { to, sdp }

SEND_ICE_CANDIDATE ------------> ICE_CANDIDATE_RECEIVED --------------->
{ to, candidate }                { from, candidate }

       <------------------------ ICE_CANDIDATE_RECEIVED <--------------- SEND_ICE_CANDIDATE
                                 { from, candidate }                     { to, candidate }

```

## Layers

### Signal

An object that provides a nice interface for handling the above protocol with
json-encoded comunications with the signaling server.

### Client

This object shall use the Signal one to handle the protocol messages exchange
taking care of the RTC* stuff. This object is the interface to the application.
