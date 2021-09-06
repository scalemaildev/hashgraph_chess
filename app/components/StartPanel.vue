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
      <h3>To begin, enter your <strong>TESTNET</strong> account information below.</h3>
    </v-col>
  </v-row>
    <v-form
      @submit.prevent="submit">
      <v-row>
	<v-spacer />
	<v-col cols="8" align="center" justify="center">
	  <v-text-field
	    v-model="accountId"
	    :error-messages="accountIdErrors"
	    required
	    @input="$v.accountId.$touch()"
	    @blur="$v.accountId.$touch()"
	    label="Account ID"/>
	</v-col>    
	<v-spacer />
      </v-row>
      <v-row>
	<v-spacer />
	<v-col cols="8" align="center" justify="center">
	  <v-text-field
	    v-model="privateKey"
	    :error-messages="privateKeyErrors"
	    type="password"
	    required
	    @input="$v.privateKey.$touch()"
	    @blur="$v.privateKey.$touch()"
	    label="Private Key"/>
	</v-col>
	<v-spacer />
      </v-row>
      <v-row>
	<v-spacer />
	<v-col cols="8" align="center" justify="center">
	  <v-btn
	    type="submit">
	    Initialize Client
	  </v-btn>
	</v-col>
	<v-spacer />
      </v-row>    
    </v-form>
    <div v-if="clientError" class="content-spaced-small">
      <v-row align="center" justify="center">
	<v-col cols="12" align="center" justify="center">
	  <span style="color: red;"><h3>An error occurred initializing the client:</h3></span>
	  <p style="color: red;">Double check your <strong>TESTNET</strong> Account ID and Private Key.</p>
	</v-col>
      </v-row>
    </div>
  </div>
</v-container>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate'
import { required, helpers } from 'vuelidate/lib/validators'

const accountIdRegex = helpers.regex('accountIdRegex', /0.0.[0-9]{3,}/);

export default {
    mixins: [validationMixin],
    
    validations: {
	accountId: { required, accountIdRegex },
	privateKey: { required },
    },
    
    data () {
	return {
	    accountId: "",
	    privateKey: "",
	    clientSet: false,
	    clientError: false,
	}
    },
    
    computed: {
	accountIdErrors () {
	    const errors = [];
	    if (!this.$v.accountId.$dirty) return errors
	    !this.$v.accountId.required && errors.push('Account ID is required.')
	    !this.$v.accountId.accountIdRegex && errors.push('Account ID should look like 0.0.xxx.')
	    return errors;
	},
	privateKeyErrors () {
	    const errors = [];
	    if (!this.$v.privateKey.$dirty) return errors
	    !this.$v.privateKey.required && errors.push('Private Key is required.')
	    return errors;
	}
    },
    
    methods: {
	...mapMutations([
	    'setActivePanel',
	]),
	...mapActions([
	    'asyncEmit'
	]),
	submit () {
	    this.$v.$touch();
	    if (!this.$v.$invalid) {
		this.initHashgraphClient(this.accountId, this.privateKey);
	    }
	},
	async initHashgraphClient (accountId, privateKey) {
	    this.clientError = false;
	    
	    const response = await this.$store.dispatch('sessionStorage/initHashgraphClient', {
		'accountId': accountId,
		'privateKey': privateKey
	    })
	    
	    if (response.result == 'SUCCESS') {
		this.setActivePanel('accountPanel');
		console.log('Hashgraph client initialized!')		
	    } else {
		this.clientError = true;
	    }
	},
    }
}  
</script>
