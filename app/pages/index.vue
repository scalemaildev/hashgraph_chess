<template>
<v-container>
  <div v-if="activePanel == 'loadingPanel'"
       class="content-spaced-mid">
    <v-row>
      <v-col cols="12" align="center" justify="center">
	<v-progress-circular
	  indeterminate
	  />
      </v-col>
      <v-col cols="12" align="center" justify="center">
	... Initializing ...
      </v-col>
    </v-row>    
  </div>
  <div v-else-if="activePanel == 'startPanel'">
    <StartPanel />
  </div>
  <div v-else-if="activePanel == 'accountPanel'">
    <AccountPanel />
  </div>
  <div v-else-if="activePanel == 'newMatchPanel'">
    <NewMatchPanel />
  </div>
</v-container>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    computed: {
	activePanel () {
	    return this.$store.state.activePanel
	},
    },
    
    mounted() {
	if (!this.$store.state.sessionStorage.hashgraphClient) {
	    this.setActivePanel('startPanel');
	} else {
	    this.setActivePanel('accountPanel');
	}
	
	this.$root.mainSocket = this.$nuxtSocket({
	    name: 'main',
	    persist: 'mainSocket'
	})
    },
    
    methods: {
	...mapMutations([
	    'setActivePanel',
	]),
    },
};
</script>
