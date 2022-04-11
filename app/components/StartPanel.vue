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
      <p>In order to use this application, you will need the <a href="https://www.hashpack.app/">HashPack</a> browser extension, as well as <a href="https://portal.hedera.com/register">Testnet account.</a>. Later versions of this application will also allow players to use their <a href="https://hedera.com/account-creation">Mainnet accounts.</a></p>
    </v-col>
  </v-row>
  <div v-show="!walletConnected">
    <v-row>
      <v-col align="center">
        <v-btn @click.prevent="initHashConnect">
          Connect HashPack Wallet
        </v-btn>
      </v-col>
    </v-row>
  </div>
  <div v-show="walletConnected">
    <v-row>
      <v-col cols="12" align="center">
        <i>Looks like you've already approved this dApp. Please reinitialize your wallet.</i>
      </v-col>
      <v-col cols="12" align="center">
        <v-btn @click.prevent="reinitHashConnect">Reinitialize</v-btn>
      </v-col>
    </v-row>
  </div>
  <div v-show="hcError">
    <v-row>
      <v-col align="center" justify="center" class="pt-0 mt-0">
          <span style="color: red;"><h4>An error occurred connecting to HashPack wallet extension.</h4></span>
      </v-col>
    </v-row>
  </div>
  <v-row class="mt-3 pt-2">
    <v-col cols="12" align="center">
      <a href="https://github.com/scalemaildev/hashgraph_chess"
         style="text-decoration: none;
                font-size: 0.8em;">GitHub Repo</a>
    </v-col>
  </v-row>
</v-container>  
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    data () {
        return {
            hcError: false
        }
    },

    mounted() {
        this.UNSET_CLIENT();
        this.CHECK_HC_DATA();
    },
    
    computed: {
        ...mapState('sessionStorage', ['WALLET_CONNECTED']),
        
        walletConnected() {
            return this.WALLET_CONNECTED
        }
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['UNSET_CLIENT',
                                           'SET_ACTIVE_PANEL']),
        ...mapMutations('localStorage', ['CHECK_HC_DATA']),
        ...mapActions('sessionStorage', ['INIT_HASH_CONNECT']),

        checkHcData() {
            
        },
        
        async initHashConnect() {
            this.hcError = false;
            const response = await this.INIT_HASH_CONNECT();
            
            if (response.success) {
                this.hcData = this.CHECK_HC_DATA;
            } else {
                this.hcError = true;
            }
        },
        
        async reinitHashConnect() {
            
            //TODO call reinit method in session storage
            
            this.SET_ACTIVE_PANEL('clientPanel');
        }
    },
};
</script>
