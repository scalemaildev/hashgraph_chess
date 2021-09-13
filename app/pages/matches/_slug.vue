<template>
<div>
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <v-container fluid class="match-header">
        <h1>Match ID: {{ this.topicIdString }}</h1>
      </v-container>
    </v-col>
  </v-row>
  <div v-if="ACTIVE_PANEL == 'loadingPanel'" class="content-spaced-mid">
    <LoadingPanel />
  </div>
  <div v-else-if="ACTIVE_PANEL == 'matchStartPanel'">
    <MatchStartPanel />
  </div>
  <div v-else-if="ACTIVE_PANEL == 'clientPanel'">
    <MatchComponentsGroup :topicId='topicIdString' />
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
    
    computed: {
        ...mapState('sessionStorage', ['ACTIVE_PANEL']),
    },
    
    created() {
        this.SET_ACTIVE_PANEL('loadingPanel');
    },
    
    mounted() {
        //if (!this.CLIENT_EXISTS) {
            //this.SET_ACTIVE_PANEL('matchStartPanel')
        //} else {
            //this.SET_ACTIVE_PANEL('clientPanel')
            //this.TOGGLE_LOCK_BUTTON(true);
        //}
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL',
                                           'TOGGLE_LOCK_BUTTON']),
        ...mapActions(['CHECK_CLIENT']),
    }
}
</script>
