# HASHGRAPH CHESS

This is an application that allows users to conduct chess matches over the [Hedera Consensus Service.](https://hedera.com/consensus-service) Chess moves (and chat messages) are submitted to the consensus service, where they are ordered as an immutable log of events. These events are then translated into board states and messages that are served to the client.

In order to use this application, you will need a Hedera [Testnet account.](https://portal.hedera.com/register) Later versions of this application will also allow players to use their [Mainnet accounts.](https://hedera.com/account-creation)

## Technical Information

This is a [NuxtJS](https://nuxtjs.org/) application that leverages several useful node modules, most notably: [chess.js](https://github.com/jhlywa/chess.js) and of course [hedera-sdk-js](https://github.com/hashgraph/hedera-sdk-js). It comes with a compose file for [docker containerization](https://www.docker.com/) which is intended for use with [Elastic Beanstalk.](https://aws.amazon.com/elasticbeanstalk/) A beta version of the application is currently hosted on [the ScalemaiL website.](https://hashgraphchessbeta.scalemail.com)

The app can be run locally via either its compose file, or the usual "npm install" -> "npm run dev" method. Since matches are stored on the HCS, you'll be able to access your match data regardless of where you run this application.

### How It Works

- Players initialize the Hedera client by entering their account information into the start panel's text fields. This client allows the user to submit moves and chat messages to the HCS via their account.
- This method of entering account information is temporary, and limited to this Testnet demo. Note that account information is currently stored in session storage *in an encrypted format.*
- The cost of submitting a message to the HCS is typically $0.0001 USD, and the cost of creating a new topic is $0.01 USD. *But since this application is running on the Testnet, no actual costs are incurred to the user.*
- Each match is a unique HCS topic, whose messages consist of JSON payloads containing information on chess moves and chat messages. The application processes these messages into the session state as it receives them.
- When connected to a match page, the app regularly (every 4 seconds) queries that HCS topic via a mirror node REST api. (Another method of doing this would be the gRPC, which is a server-side only subscription method that pushes new HCS messages to the client.)
- The game state is stored in vuex, making it readily accessible from any component via a plethora of mutations, actions, and getters. The state is kept in session storage, meaning that it persists within a tab even after a page refresh.
- A dummy game is used client-side to display board states, and validate moves before sending them to the HCS. Instead of sending individual moves to the HCS, the [Portable Game Notation](https://en.wikipedia.org/wiki/Portable_Game_Notation) from the dummy game is sent. The canonical game state is only updated when it receives a new PGN from the topic. This is done to prevent deviation in game states in case of a failed message submission.

## Future Steps

### Player Validation Improvement

In the future, player validation (verifying what account sent the information to the HCS topic) will be done using a spoof-proof method, such as signing with public/private keys.

### Client Initialization Improvement

To prevent players from having to input their account ID's and private keys into text fields, this application will utilize browser extension wallets whenever they become available for Hedera. I will still keep the option to input the fields manually, but I do not recommend developing a habit of typing private keys into websites.

### Move Input Improvement

The move input form will be replaced with an interactive chess board. Players will be able to click and move pieces instead of manually entering move coordinates.

### UI Improvements

I will continue to work on the user interface to allow the application to be used across a wide variety of desktop and mobile devices.

### Mainnet Migration

Once the application is deemed secure and serviceable, the client will be pointed toward the Hedera Mainnet. Users will be able to conduct chess matches using tinybars from their Mainnet accounts.

## Credits

- The chess sprites are from [Daniela De Lena's spritesheet.](https://dilena.de/chess-artwork-pieces-and-board-art-assets)
