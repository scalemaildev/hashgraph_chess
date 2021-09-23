<template>
<div>
  <div v-if="!matchDataLoaded" class="content-spaced-mid">
    <LoadingPanel loadingText="SUBSCRIBING" />
  </div>
  <div v-else>
    <v-container fluid class="matchComponents-wrapper">
      <v-row fluid justify='space-between'>
        <v-col xs="12" sm="12" md="6" lg="6" xl="6">
          <GamePanel :topicId="topicId"
                     :isObserver="isObserver" />
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="6" xl="6">
          <ChatPanel :topicId="topicId"
                     :isObserver="isObserver" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
    props: ['topicId'],
    
    data () {
        return {
            matchDataLoaded: false
        }
    },
    
    computed: {
        ...mapState('sessionStorage', ['ACCOUNT_ID']),
        ...mapGetters('sessionStorage', ['MATCH_DATA']),
        matchData () {
            return this.MATCH_DATA(this.topicId);
        },
        isObserver() {
            let playerList = [this.MATCH_DATA(this.topicId).playerWhite, this.MATCH_DATA(this.topicId).playerBlack];
            
            return !playerList.includes(this.ACCOUNT_ID);
        }
    },
    
    watch: {
        matchData (newMatchData, oldMatchData) {
            if (!newMatchData.created) {
                this.matchDataLoaded = false;
            } else {
                this.matchDataLoaded = true;
            }
        }
    },
    
    mounted() {
        this.SUBSCRIBE_TO_TOPIC(this.topicId);
    },
    
    methods: {
        ...mapActions('sessionStorage', ['SUBSCRIBE_TO_TOPIC'])
    }
}
</script>
