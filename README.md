# Cosmicrafts Frontend

This project contains the frontend of cosmicrafts developen on React for the Internet Computer.

It contains the game build for webgl and all the logic between the game and the backend on IC

## Websockets

Follow this [tutorial](https://medium.com/@ilbert/websockets-on-the-ic-getting-started-5f8bcdfaabdc) for the implementation of ic-websocket and this [example](https://github.com/iamenochchirima/ic-websockets-pingpong-mo/tree/main) for the Motoko implementation

**For the current version of ic-websocket the identity has a bug where if you pass it directly the websocket closes. When this bug is fixed on the side of ic-websocket, this repository will be uptaded**

For the moment the 
```identity._inner```
is being sent instead of identity, this causes a known bug where the Principal signing the calls for the direct calls to IC is not the same as the one meking the calls on the websockets.

## `In the Roadmap`
In a near future we plan to create a webpage and/or a section within the game to display the statistics. While this is done, you can check the statistics directly on [icscan](https://icscan.io/canister/jybso-3iaaa-aaaan-qeima-cai)
