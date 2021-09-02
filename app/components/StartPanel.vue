<template>
<v-container class="content-body">
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <h1>Welcome to ♄ashgraph Chess.</h1>
    </v-col>
  </v-row>
  <v-row align="center" justify="center">
    <v-col cols="12" align="center" justify="center">
      <p>This is an application that allows players to conduct chess matches over the <a href="https://hedera.com/consensus-service">Hedera Consensus Service.</a> Chess moves (and chat messages) are submitted to the Hedera network for consensus, where they are ordered as an immutable log of events. These events are then translated into the moves and messages that are served to the client (you).</p>
      <p>In order to use this application, you will need a Hedera Hashgraph <a href="https://portal.hedera.com/register">Testnet account.</a> Later versions of this application will also allow players to use their <a href="https://hedera.com/account-creation">Mainnet accounts.</a></p>
    </v-col>
  </v-row>
  <v-row align="center" justify="center">
    <v-col cols="12" align="center" justify="center">
      <h3>To begin, enter your Testnet account information below.</h3>
    </v-col>
  </v-row>
  <v-row>
    <v-spacer />
    <v-col cols="8" align="center" justify="center">
      <v-text-field
	label="Account ID"/>
    </v-col>    
    <v-spacer />
  </v-row>
  <v-row>
    <v-spacer />
    <v-col cols="8" align="center" justify="center">
      <v-text-field
	label="Private Key"/>
    </v-col>
    <v-spacer />
  </v-row>
  <v-row>
    <v-spacer />
    <v-col cols="8" align="center" justify="center">
      <v-btn>
	Initialize Client
      </v-btn>
    </v-col>
    <v-spacer />
  </v-row>
</v-container>  
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    methods: {
	...mapMutations([
	    'setActivePanel'
	])
    }
}  
</script>
