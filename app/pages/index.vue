<template>
<div>
  <div v-show="ACTIVE_PANEL == 'loadingPanel'" class="spaced-mid">
    <LoadingPanel loadingText='LOADING'
                  warningTime=10000 />
    </v-row>
  </div>
  <div v-show="ACTIVE_PANEL == 'startPanel'">
    <StartPanel />
  </div>
  <div v-show="ACTIVE_PANEL == 'clientPanel'">
    <AccountPanel />
  </div>
  <div v-show="ACTIVE_PANEL == 'newMatchPanel'">
    <NewMatchPanel />
  </div>
  <div v-show="ACTIVE_PANEL == 'joinMatchPanel'">
    <JoinMatchPanel />
  </div>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    computed: {
        ...mapState('sessionStorage', ['ACTIVE_PANEL',
                                       'WALLET_DATA_FOUND'])
    },

    mounted() {
        this.CHECK_WALLET_DATA();

        if (this.WALLET_DATA_FOUND) {
            this.REINIT_HASH_CONNECT();
            this.SET_ACTIVE_PANEL('clientPanel');
        } else {
            this.SET_ACTIVE_PANEL('startPanel');
        }
    },
    
    methods: {
        ...mapMutations('localStorage', ['CHECK_WALLET_DATA']),
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL']),
        ...mapActions('sessionStorage', ['REINIT_HASH_CONNECT'])
    },
};
</script>
