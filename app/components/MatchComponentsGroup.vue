<template>
<div>
  <div v-if="!matchDataLoaded" class="spaced-mid">
    <LoadingPanel loadingText="SUBSCRIBING"
                  warningTime=12000 />
  </div>
  <div v-else>
    <v-container fluid class="matchComponents-wrapper">
      <v-row fluid justify='space-between'>
        <v-col cols="12" md="6">
          <GamePanel :topicId="topicId"
                     :userType="userType" />
        </v-col>
        <v-col cols="12" md="6">
          <ChatPanel :topicId="topicId"
                     :userType="userType" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

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
        userType() {
            return this.MATCH_DATA(this.topicId).userType;
        }
    },
    
    watch: {
        matchData (newMatchData, oldMatchData) {
            if (newMatchData.initialQueryComplete) {
                this.matchDataLoaded = true;
            } else {
                this.matchDataLoaded = false;
            }
        }
    },
    
    mounted() {
        this.CREATE_TOPIC_MESSAGE_COUNT(this.topicId);
        window.setInterval(() => {
            this.QUERY_TOPIC(this.topicId);
        }, 4000)
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['CREATE_TOPIC_MESSAGE_COUNT']),
        ...mapActions('sessionStorage', ['QUERY_TOPIC'])
    }
}
</script>
