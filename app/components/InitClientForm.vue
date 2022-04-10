<template>
<div>
  <v-row>
    <v-col align="center">
      <v-btn @click.prevent="initHashConnect">
        Connect HashPack Wallet
      </v-btn>
    </v-col>
    <v-col align="center" justify="center" class="pt-0 mt-0">
      <div v-if="clientError">
        <span style="color: red;"><h4>An error occurred connecting to HashPack wallet extension.</h4></span>
      </div>
    </v-col>
  </v-row>
</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data () {
        return {
            connection: false,
            clientError: false
        }
    },
    
    methods: {
        ...mapActions('sessionStorage', ['INIT_HASH_CONNECT']),
        
        async initHashConnect() {
            this.clientError = false;
            this.connection = false;
            const response = this.INIT_HASH_CONNECT();

            if (response.success) {
                this.connection = true;
            } else {
                this.clientError = true;
            }
        },
    }
}
</script>
