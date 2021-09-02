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
  <div v-if="!clientSet && !clientInitializing">
    <v-row>
      <v-spacer />
      <v-col cols="8" align="center" justify="center">
	<v-text-field
	  v-model="accountId"
	  :rules="[rules.accountId]"
	  label="Account ID"/>
      </v-col>    
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="8" align="center" justify="center">
	<v-text-field
	  v-model="privateKey"
	  type="password"
	  label="Private Key"/>
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="8" align="center" justify="center">
	<v-btn
	  @click="initHashgraphClient()">
	  Initialize Client
	</v-btn>
      </v-col>
      <v-spacer />
    </v-row>
    <div v-if="clientError" class="content-spaced-small">
      <v-row align="center" justify="center">
	<v-col cols="12" align="center" justify="center">
	  <span style="color: red;"><h3>An error occurred initializing the client. Check the console log for details.</h3></span>
	</v-col>
      </v-row>
    </div>
  </div>
  <div v-if="!clientSet && clientInitializing" class="content-spaced-mid">
    <v-row>
      <v-col cols="12" align="center" justify="center">
	<v-progress-circular
	  indeterminate
	  />
      </v-col>
      <v-col cols="12" align="center" justify="center">
	... Initializing HCS Client ...
      </v-col>
    </v-row>
  </div>
</v-container>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
    data () {
	return {
	    accountId: "",
	    privateKey: "",
	    clientInitializing: false,
	    clientSet: false,
	    clientError: false,
	    rules: {
		accountId: value => {
		    const pattern = /0.0.[0-9]{3,}/
		    return pattern.test(value) || "Account ID should look like 0.0.xxx"
		}
	    }
	}
    },
    methods: {
	...mapMutations([
	    'setActivePanel'
	]),
	...mapActions([
	    'asyncEmit'
	]),
	async initHashgraphClient () {
	    this.clientInitializing = true;
	    const result = await this.asyncEmit({
		'eventName': 'initHashgraphClient',
		'accountId': this.accountId,
		'privateKey': this.privateKey
	    });
	    console.log(result);
	},
    }
}  
</script>
