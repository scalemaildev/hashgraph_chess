<template>
<v-container class="content-body pb-2">
  <v-row>
    <v-col cols="12" align="center">
      <h1>Welcome to Hashgraph Chess</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" align="center">
      <p>This is an application that allows players to conduct chess matches over the <a href="https://hedera.com/consensus-service">Hedera Consensus Service.</a> Chess moves (and chat messages) are submitted to the consensus service, where they are ordered as an immutable log of events. These events are then translated into the board states and messages that are served to the client via an API call.</p>
      <p>In order to use this application, you will need the <a href="https://www.hashpack.app/">HashPack</a> browser extension wallet, as well as a <a href="https://hedera.com/account-creation">Mainnet account</a>. Use the <b>Connect Wallet</b> button on the navbar.</p>
    </v-col>
  </v-row>
  <v-row class="mt-3 pt-2">
    <v-col cols="12" align="center">
      <a href="https://github.com/scalemaildev/hashgraph_chess"
         style="text-decoration: none;
                font-size: 0.8em;">GitHub Repo</a>
    </v-col>
  </v-row>
</v-container>  
</template>
