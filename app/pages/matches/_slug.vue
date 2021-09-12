<template>
<div>
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <v-container fluid class="match-header">
        <h1>Match ID: {{ this.topicIdString }}</h1>
      </v-container>
    </v-col>
  </v-row>
  <div v-show="ACTIVE_PANEL == 'loadingPanel'" class="content-spaced-mid">
    <LoadingPanel />
  </div>
  <div v-show="ACTIVE_PANEL == 'matchStartPanel'">
    <MatchStartPanel />
  </div>
  <div v-show="ACTIVE_PANEL == 'clientPanel'">
    <MatchComponentsGroup />
  </div>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    async asyncData({ params }) {
        const topicIdString = params.slug;
        
        return { topicIdString }
    },
    
    data () {
        return {
            subscribing: true,
            subscriptionError: false
        }
    },
    
    computed: {
        ...mapState('sessionStorage', ['CLIENT_EXISTS',
                                       'ACTIVE_PANEL',
                                       'ACCOUNT_ID',
                                       'MATCHES']),
        topicData () {
            return this.MATCHES[this.topicIdString];
        },
    },

    created() {
        this.SET_ACTIVE_PANEL('loadingPanel');
    },
    
    mounted() {
        this.startup();
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL',
                                           'TOGGLE_LOCK_BUTTON']),
        ...mapActions('sessionStorage', ['SUBSCRIBE_TO_TOPIC']),
        startup() {
            if (!this.CLIENT_EXISTS) {
                this.SET_ACTIVE_PANEL('matchStartPanel')
            } else {
                this.$nextTick(function () {
                    this.SUBSCRIBE_TO_TOPIC(this.topicIdString)
                })
                this.TOGGLE_LOCK_BUTTON(true);
            }
        },
    },
}
</script>
