<template>
<div>
  <v-row>
    <v-col align="center">
      <v-btn @click.prevent="initHederaClient">
          Connect HashPack Wallet
      </v-btn>
    </v-col>
  </v-row>
</div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
    data () {
        return {
            clientError: false
        }
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL',
                                           'SET_ACCOUNT_ID',
                                           'SET_PRIVATE_KEY',
                                           'TOGGLE_LOCK_BUTTON']),
        ...mapActions('sessionStorage', ['INIT_HEDERA_CLIENT']),
        
        async initHederaClient() {
            console.log('hi');
        },
        
        /*
        async initHederaClient_OLD () {
            this.clientError = false;
            
            const response = await this.INIT_HEDERA_CLIENT({
                'accountId': this.accountId,
                'privateKey': this.privateKey
            });
            
            if (response.success) {
                this.SET_ACCOUNT_ID(this.accountId);
                this.SET_PRIVATE_KEY(this.privateKey);
                this.TOGGLE_LOCK_BUTTON(true);
                this.accountId = "";
                this.privateKey = "";
                this.SET_ACTIVE_PANEL('clientPanel');
            } else {
                this.privateKey = "";
                this.clientError = true;
            }
        },
        */
    }
}
</script>
