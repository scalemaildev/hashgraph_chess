<template>
<div>
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <v-container fluid class="match-header">
        <h1>Match ID: {{ this.topicId }}</h1>
      </v-container>
    </v-col>
  </v-row>
  <div v-if="ACTIVE_PANEL == 'loadingPanel'" class="content-spaced-mid">
    <LoadingPanel loadingText="LOADING" />
  </div>
  <div v-else-if="ACTIVE_PANEL == 'startPanel'">
    <MatchStartPanel />
  </div>
  <div v-else-if="ACTIVE_PANEL == 'clientPanel'">
    <div v-if="!matchDataLoaded" class="content-spaced-mid">
      <LoadingPanel loadingText="SUBSCRIBING" />
    </div>
    <div v-else-if="matchDataLoaded">
      <v-container>
        <v-row>
          <v-col>
            <GamePanel :topicId="topicId" />
          </v-col>
          <v-col>
            <ChatPanel :topicId="topicId" />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    async asyncData({ params }) {
        const topicId = params.slug;
        
        return { topicId }
    },
    
    data () {
        return {
            matchDataLoaded: false,
        }
    },
    
    computed: {
        ...mapState('sessionStorage', ['ACTIVE_PANEL',
                                       'ACCOUNT_ID',
                                       'PRIVATE_KEY']),
        ...mapGetters('sessionStorage', ['MATCH_DATA']),
        matchData () {
            return this.MATCH_DATA(this.topicId);
        },
        clientReady () {
            return this.ACTIVE_PANEL == 'clientPanel';
        }
    },

    watch: {
        matchData (newMatchData, oldMatchData) {
            if (!newMatchData.created) {
                this.matchDataLoaded = false;
            } else {
                this.matchDataLoaded = true;
            }
        },
        clientReady (newValue, oldValue) {
            if (newValue) {
                this.SUBSCRIBE_TO_TOPIC(this.topicId);
            }
        }
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
        ...mapActions('sessionStorage', ['INIT_HASHGRAPH_CLIENT',
                                        'SUBSCRIBE_TO_TOPIC']),
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
