# Take home challenge for front-end engineer

The following series of assessments is designed to test the relatively broad set of capabilities expected of the modern front-end engineer. Note, this test is private and you are trusted to keep both the assessment and your submission confidential.

## 1. Layout. HTML and CSS.

This is simplified rendering of the Chatroulette application. The goal is to produce responsive HTML and CSS that approximates how you would approach structuring the layout if asked to do so.

- This is the HTML/CSS only. We don't want a working application. Just something that shows you can produce HTML/CSS that deals with the problems stated below.
- Any combination of mobile and desktop chat partners is possible. That is, mobile-to-mobile, mobile-to-desktop, desktop-to-desktop.
- We don't ever want to "contain" the video unnecessarily: if a desktop user is connecting to a mobile user, depending on their orientation, each user may end up seeing empty space around their partner stream. This is the key topic to think through, and many video applications do it differently.
- Video aspect ratios are 16:9 (portait or landscape) and 4:3 (portrait or lanscape).
- Maximum video stream size is 1920 wide.

### Mobile wireframe

    +-------------------------+
    |                +------+ |
    |                |      | |
    |                |      | |
    |                | LOCAL| |
    |                |      | |
    |                +------+ |
    |                         |
    |                         |
    |                         |
    |                         |
    |       PARTNER           |
    |                         |
    |         +------+        |
    |         | NEXT |        |
    +---------+------+--------+

  ### Desktop wireframe

    +-----------------------------------------------------------+
    |              +----------------------------+               |
    |              |                            |               |
    |              |                            |               |
    |              |                            |               |
    |              |                            |               |
    |              |         REMOTE             |               |
    |              |                            |               |
    |              |                            |               |
    |              |                            |               |
    |              +---------+--------+---------+               |
    |              |         |        |         |               |
    |              |         | LOCAL  |         |               |
    |              |         |        |         |               |
    |              +---------+--------+---------+               |
    |              |           |NEXT|           |               |
    |              +----------------------------+               |
    +-----------------------------------------------------------+


## 2. Analysis

Paul the product manager has asked you to think through the viability of a feature.
His brief goes something like this,

> Inappropriate content has become a significant issue and I want to ask our users to evaluate each other so we can "crowd source" who is good, and who is not. I propose we survey our users after every 6 conversations to ask them to choose either the best or the worst of these conversations (I'm not sure which will be more effective yet).

He goes on,
>  I imagine we would display the 6 images as headshots and ask the user to select exactly one. Once they've selected, we'll find their next partner. I imagine that over time the good or bad apples will be separated from the rest, which will allow us to take appropriate corrective action.

We can assume for this exercise that 30% of the site's users are bad and that the average session duration is 25 conversations. Do you think Paul's idea will be successful? Why or why not?

## 3. JavaScript. WebRTC

Write a one-to-one JavaScript WebRTC client. You can implement the signaling however you want, use a service, or a third-party tool. We're principally interested in the client.

You can assume modern browsers and the look-and-feel is unimportant (in fact, no UI is necessary at all). Your submission should be able to connect to itself and be

1. Simple, clean, and concise.
2. Pure WebRTC. No libraries.
3. Tested.

Bonus points for any thought that goes into resilience from network or media errors, changes, etc. 