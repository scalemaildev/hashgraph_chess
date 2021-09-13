<template>
<div>
  <div v-show="ACTIVE_PANEL == 'loadingPanel'" class="content-spaced-mid">
    <v-row>
      <v-col cols="12" align="center" justify="center">
        <v-progress-circular indeterminate />
      </v-col>
      <v-col cols="12" align="center" justify="center">
        <p>... LOADING ...</p>
      </v-col>
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
                                       'PRIVATE_KEY'])
    },

    mounted() {
        if (!!this.ACCOUNT_ID && !!this.PRIVATE_KEY) {
            this.$nextTick(() => {
                this.restoreClient();
            });
        } else {
            this.SET_ACTIVE_PANEL('startPanel');
        }
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL']),
        ...mapActions('sessionStorage', ['INIT_HASHGRAPH_CLIENT']),
        async restoreClient() {
            const response = await this.INIT_HASHGRAPH_CLIENT({
                accountId: this.ACCOUNT_ID,
                privateKey: this.PRIVATE_KEY
            });
        }
    },
};
</script>
