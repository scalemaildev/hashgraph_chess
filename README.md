# HASHGRAPH CHESS

This is an application that allows users to conduct chess matches over the [Hedera Consensus Service.](https://hedera.com/consensus-service) Chess moves (and chat messages) are submitted to the consensus service, where they are ordered as an immutable log of events. These events are then translated into board states and messages that are served to the client.

In order to use this application, you will need a Hedera [Mainnet account](https://hedera.com/account-creation) as well as a [HashPack](https://www.hashpack.app/) wallet version v2.4.6+.

## Technical Information

This is a [NuxtJS](https://nuxtjs.org/) application that leverages several useful node modules, most notably: [chess.js](https://github.com/jhlywa/chess.js), [hashconnect](https://www.hashpack.app/hashconnect), and of course [hedera-sdk-js](https://github.com/hashgraph/hedera-sdk-js). It comes with a compose file for [docker containerization](https://www.docker.com/) which is intended for use with [Elastic Beanstalk.](https://aws.amazon.com/elasticbeanstalk/) A live version of the application is currently hosted on [hashgraphchess.com.](https://hashgraphchess.com)

The app can be run locally via either its compose file, or the usual "npm install" -> "npm run dev" method. Since matches are stored on the HCS, you'll be able to access your match data regardless of where you run this application. **You also need to be using HTTPS in your local environment.** I recommend using mkcert for 'localhost' and putting the .pem keys in the ./app directory.

### How It Works

- Players connect their HashPack wallet to the app via HashConnect. This will allow the app to use their Hedera wallet to create HCS topics and send messages.
- The cost of submitting a message to the HCS is typically $0.0001 USD, and the cost of creating a new topic is $0.01 USD.
- Each match is a unique HCS topic, whose messages consist of JSON payloads containing information on chess moves and chat messages. The application processes these messages into the session state as it receives them.
- When connected to a match page, the app regularly (every 4 seconds) queries that HCS topic via a mirror node REST api.
- The game state is stored in vuex, making it readily accessible from any component via a plethora of mutations, actions, and getters. The state is kept in session storage, meaning that it persists within a tab even after a page refresh.
- A dummy game is used client-side to display board states, and validate moves before sending them to the HCS. Instead of sending individual moves to the HCS, the [Portable Game Notation](https://en.wikipedia.org/wiki/Portable_Game_Notation) from the dummy game is sent. The canonical game state is only updated when it receives a new PGN from the topic. This is done to prevent deviation in game states in case of a failed message submission.

## Future Steps

### Move Input Improvement

The move input form will be replaced with an interactive chess board. Players will be able to click and move pieces instead of manually entering move coordinates.

### UI Improvements

I will continue to work on the user interface to allow the application to be used across a wide variety of desktop and mobile devices.

## Credits

- The chess sprites are from [Daniela De Lena's spritesheet.](https://dilena.de/chess-artwork-pieces-and-board-art-assets)
