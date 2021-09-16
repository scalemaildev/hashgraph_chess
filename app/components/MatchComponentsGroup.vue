<template>
<div>
  <div v-if="!matchDataLoaded" class="content-spaced-mid">
    <LoadingPanel loadingText="SUBSCRIBING" />
  </div>
  <div v-else>
    <v-container fluid class="matchComponents-wrapper">
      <v-row fluid justify='space-between'>
        <v-col xs="12" sm="12" md="6" lg="6" xl="6">
          <GamePanel :topicId="topicId" />
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="6" xl="6">
          <ChatPanel :topicId="topicId" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['topicId'],
    
    data () {
        return {
            matchDataLoaded: false
        }
    },
    
    computed: {
        ...mapGetters('sessionStorage', ['MATCH_DATA']),
        matchData () {
            return this.MATCH_DATA(this.topicId);
        },
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
