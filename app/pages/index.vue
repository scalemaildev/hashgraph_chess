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
                                       'ACCOUNT_ID',
                                       'PRIVATE_KEY',
                                       'HEDERA_CLIENT'])
    },

    mounted() {
        this.SET_ACTIVE_PANEL('startPanel');
        this.$nextTick(() => {
            this.CHECK_HC_DATA();
        });
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL']),
        ...mapMutations('localStorage', ['CHECK_HC_DATA']),
    },
};
</script>
