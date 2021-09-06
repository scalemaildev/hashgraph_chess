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
	clientSet () {
	    return this.$store.state.sessionStorage.clientExists;
	},
	activePanel () {
	    return this.$store.state.activePanel;
	},
    },
    mounted() {
	this.$root.mainSocket = this.$nuxtSocket({
	    name: 'main',
	    persist: 'mainSocket',
	    reconnection: false
	})

	if (!this.clientSet) {
	    this.setActivePanel('startPanel')
	} else {
	    this.setActivePanel('accountPanel')
	    this.toggleLockButton(true)
	}
    },
    
    methods: {
	...mapMutations([
	    'setActivePanel',
	    'toggleLockButton'
	]),
    },
};
</script>
