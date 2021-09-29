# HASHGRAPH CHESS

This is an application that allows users to conduct chess matches over the [Hedera Consensus Service.](https://hedera.com/consensus-service) Chess moves (and chat messages) are submitted to the consensus service, where they are ordered as an immutable log of events. These events are then translated into the board states and messages that are served to the client.

In order to use this application, you will need a Hedera Hashgraph [Testnet account.](https://portal.hedera.com/register) Later versions of this application will also allow players to use their [Mainnet accounts.](https://hedera.com/account-creation)

## Technical Information

This is a [NuxtJS](https://nuxtjs.org/) application that leverages several useful modules, most notably: [chess.js](https://github.com/jhlywa/chess.js), [nuxt-socket-io](https://github.com/richardeschloss/nuxt-socket-io), and of course [hedera-sdk-js](https://github.com/hashgraph/hedera-sdk-js). It also comes with a compose file for [docker containerization](https://www.docker.com/) which is intended for use with [Elastic Beanstalk.](https://aws.amazon.com/elasticbeanstalk/)

The app can be run locally via either its compose file, or the usual "npm install" -> "npm run dev" method.

### How It Works

- The hashgraph functionality sits in the server middleware, where it's utilized by socket.io (specifically a socket provided by the nuxt-socket-io module).
- The NuxtJS front-end allows users to pass commands to the server middleware, where they're emitted to the HCS via the socket. This includes the command to subscribe to an HCS topic.
- When the server middleware receives a response from the HCS topic subscription, it passes that information along to the vuex state for processing. Once the new information is processed, it's served to the client (usually as a new chess move or chat message). Some data might be rejected, such as double moves, blank messages, or anything sent to the topic by a non-player.
- The game state is stored in vuex, making it readily accessible from any component via a plethora of mutations, actions, and getters. Most of the data is stored in session storage, meaning it persists within a tab even after a page refresh.
- A dummy game is used client-side to display board states, and validate moves before sending them to the HCS. Instead of sending individual moves to the HCS, the [Portable Game Notation](https://en.wikipedia.org/wiki/Portable_Game_Notation) from the dummy game is sent. The canonical game state is only updated when it receives a PGN from the topic subscription. This is done to prevent deviation in game states.

## Future Steps

### Player Validation Improvement

In the future, player validation (verifying what account sent the information to the HCS topic) will be done using a spoof-proof method, such as signing with public/private keys.

### Client Initialization Improvement

To prevent players from having to input their account ID's and private keys into text fields, this application will utilize browser extension wallets whenever they become available for Hedera Hashgraph. I will still keep the option to input the fields manually, of course.

### Move Input Improvement

The move input form will be replaced with an interactive chess board.

### UI Improvements

I will continue to work on the user interface to allow the application to be used across a wide variety of desktop and mobile devices.

### Mainnet Migration

Once the application is deemed secure and serviceable, the client will be pointed toward the Hedera Hashgraph Mainnet. Users will be able to conduct chess matches using tinybars from their Mainnet accounts. At that time, the application will also be hosted on AWS Elastic Beanstalk for public use.

## Credits

- The chess sprites are from [Daniela De Lena's spritesheet.](https://dilena.de/chess-artwork-pieces-and-board-art-assets)
