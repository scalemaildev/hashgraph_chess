<template>
<v-container class="content-body">
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <h1>Welcome to ♄ashgraph Chess.</h1>
    </v-col>
  </v-row>
  <v-row align="center" justify="center">
    <v-col cols="12" align="center" justify="center">      
      <p>This is an application that allows players to play chess matches over the <a href="https://hedera.com/consensus-service">Hedera Consensus Service.</a> Chess moves (and chat messages) are submitted to the Hedera network for consensus, where they are ordered as an immutable log of events. These events are then translated into the moves and messages that are served to the client (you).</p>
      <p>In order to use this application, you will need a Hedera Hashgraph <a href="https://portal.hedera.com/register">Testnet</a> account ID and private key. Later versions of this application will also allow players to use their <a href="https://hedera.com/account-creation">Mainnet accounts.</a></p>
      <p>Matches are created with the account ID's of both players specified, so you will need to know the ID of your opponent before starting the match. Others can use their own account ID's to observe your match, but will be unable to move pieces or send chat messages.</p>
    </v-col>
  </v-row>
  <v-row align="center" justify="center">
    <v-col cols="12" align="center" justify="center">      
      <h3>You can begin a new chess match, or resume a match in-progress, via the buttons on the navbar header.</h3>
    </v-col>
  </v-row>
</v-container>  
</template>

<script>
</script>
