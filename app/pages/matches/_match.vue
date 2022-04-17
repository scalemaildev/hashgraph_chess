<template>
<div>
  <div align="center" justify="center" class="match-header">
    <h1>Match ID: {{ this.topicId }}</h1>
  </div>
  <div v-if="ACTIVE_PANEL == 'loadingPanel'" class="spaced-mid">
    <LoadingPanel loadingText="LOADING"
                  warningTime=20000 />
  </div>
  <div v-else-if="ACTIVE_PANEL == 'startPanel'">
    <MatchStartPanel />
  </div>
  <div v-else-if="ACTIVE_PANEL == 'clientPanel'">
    <MatchComponentsGroup :topicId="topicId" />
  </div>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    async asyncData({ params }) {
        const topicId = params.match;
        
        return { topicId }
    },
    
    computed: {
        ...mapState('sessionStorage', ['ACTIVE_PANEL',
                                       'WALLET_DATA_FOUND'])
    },
    
    created() {
        this.SET_ACTIVE_PANEL('loadingPanel');
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
    }
}
</script>
