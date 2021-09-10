<template>
<v-container>
  <div v-if="activePanel == 'loadingPanel'" class="content-spaced-mid">
    <v-row>
      <v-col cols="12" align="center" justify="center">
	<v-progress-circular indeterminate />
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
	    return this.$store.state.sessionStorage.CLIENT_EXISTS;
	},
	activePanel () {
	    return this.$store.state.ACTIVE_PANEL;
	},
    },
    
    mounted() {
	if (!this.clientSet) {
	    this.SET_ACTIVE_PANEL('startPanel')
	} else {
	    this.SET_ACTIVE_PANEL('accountPanel')
	    this.TOGGLE_LOCK_BUTTON(true)
	}
    },
    
    methods: {
	...mapMutations([
	    'SET_ACTIVE_PANEL',
	    'TOGGLE_LOCK_BUTTON'
	]),
    },
};
</script>
