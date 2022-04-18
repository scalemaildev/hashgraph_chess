<template>
<v-app-bar elevation="4" app>
  <div v-if="!SMALL_SCREEN">
    <h1 style="display: inline">Hashgraph Chess</h1> <sup><sup>Beta</sup></sup>
  </div>
  <div v-else>
    <h1 style="display: inline">♄-Chess</h1> <sup><sup>Beta</sup></sup>
  </div>
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
</v-app-bar>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    computed: {
        ...mapState(['SMALL_SCREEN']),
        ...mapState('sessionStorage', ['WALLET_CONNECTED']),
        
        walletConnected() {
            return this.WALLET_CONNECTED;
        }
    },
    
    methods: {
        ...mapMutations('localStorage', ['CLEAR_WALLET_DATA']),
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL']),
        ...mapActions('sessionStorage', ['INIT_HASH_CONNECT']),
        
        initHashConnect() {
            this.INIT_HASH_CONNECT();
        },
        disconnectWallet() {
            this.CLEAR_WALLET_DATA();
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
