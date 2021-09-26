<template>
<div>
  <div v-if="!matchDataLoaded || !gameDataLoaded" class="content-spaced-mid">
    <LoadingPanel loadingText="SUBSCRIBING"
                  warningTime=12000 />
  </div>
  <div v-else>
    <v-container fluid class="matchComponents-wrapper">
      <v-row fluid justify='space-between'>
        <v-col xs="12" sm="12" md="6" lg="6" xl="6">
          <GamePanel :topicId="topicId"
                     :userType="userType" />
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="6" xl="6">
          <ChatPanel :topicId="topicId"
                     :userType="userType" />
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
            matchDataLoaded: false,
            gameDataLoaded: false,
            subscriptionTimeout: false
        }
    },
    
    computed: {
        ...mapState('sessionStorage', ['ACCOUNT_ID']),
        ...mapGetters('sessionStorage', ['MATCH_DATA',
                                        'GAME_INSTANCE']),
        matchData () {
            return this.MATCH_DATA(this.topicId);
        },
        gameData () {
            return this.GAME_INSTANCE(this.topicId);
        },
        userType() {
            return this.MATCH_DATA(this.topicId).userType;
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
        gameData (newGameData, oldGameData) {
            if (!newGameData) {
                this.gameDataLoaded = false;
            } else {
                this.gameDataLoaded = true;
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
