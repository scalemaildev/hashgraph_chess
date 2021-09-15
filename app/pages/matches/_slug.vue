<template>
<v-container>
  Match Slug
</v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    async asyncData({ params }) {
        const topicId = params.slug;
        
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
        ...mapActions('sessionStorage', ['INIT_HASHGRAPH_CLIENT']),
        async restoreClient() {
            const response = await this.INIT_HASHGRAPH_CLIENT({
                accountId: this.ACCOUNT_ID,
                privateKey: this.PRIVATE_KEY
            });

            if (response.result == 'SUCCESS') {
                this.SET_ACTIVE_PANEL('clientPanel');
            }
        },
    }
}
</script>
