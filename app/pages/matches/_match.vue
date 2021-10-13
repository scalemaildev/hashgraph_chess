<template>
<div>
  <div align="center" justify="center" class="match-header">
    <h1>Match ID: {{ this.topicId }}</h1>
  </div>
  <div v-if="ACTIVE_PANEL == 'loadingPanel'" class="spaced-mid">
    <LoadingPanel loadingText="LOADING"
                  warningTime=12000 />
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
                                       'ACCOUNT_ID',
                                       'PRIVATE_KEY'])
    },
    
    created() {
        this.SET_ACTIVE_PANEL('loadingPanel');
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
        ...mapActions('sessionStorage', ['INIT_HEDERA_CLIENT']),
        async restoreClient() {
            const response = await this.INIT_HEDERA_CLIENT({
                accountId: this.ACCOUNT_ID,
                privateKey: this.PRIVATE_KEY
            });

            if (response.success) {
                this.SET_ACTIVE_PANEL('clientPanel');
            }
        },
    }
}
</script>
