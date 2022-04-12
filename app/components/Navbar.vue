<template>
<v-toolbar color="rgba(18, 32, 59, 0.8);" class="navbar-wrapper">
  <v-toolbar-title class="navbar-backing">
    <h2 style="display: inline">Hashgraph Chess</h2> <sup>Beta</sup>
  </v-toolbar-title>
  <v-spacer />
  <div v-if="!walletConnected">
    <v-btn @click.prevent="initHashConnect">
      Connect Wallet
    </v-btn>
  </div>
  <div v-else>
    <v-btn @click.prevent="disconnectWallet">
      Disconnect Wallet
    </v-btn>
  </div>
</v-toolbar>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    computed: {
        ...mapState('sessionStorage', ['WALLET_CONNECTED']),
        
        walletConnected() {
            return this.WALLET_CONNECTED;
        }
    },
    
    methods: {
        ...mapMutations('localStorage', ['CHECK_HC_DATA',
                                         'CLEAR_HC_DATA']),
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL',
                                           'DISCONNECT_WALLET']),
        ...mapActions('sessionStorage', ['INIT_HASH_CONNECT']),
        
        initHashConnect() {
            this.INIT_HASH_CONNECT();
        },
        disconnectWallet() {
            this.CLEAR_HC_DATA();
            this.DISCONNECT_WALLET();
            this.SET_ACTIVE_PANEL('startPanel');
        }
    },
}
</script>

<style scoped>
.v-toolbar {
    color: #e0e0e0;
}
</style>
