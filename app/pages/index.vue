<template>
<v-container>
  <div v-if="ACTIVE_PANEL == 'loadingPanel'" class="content-spaced-mid">
    <v-row>
      <v-col cols="12" align="center" justify="center">
	<v-progress-circular indeterminate />
      </v-col>
      <v-col cols="12" align="center" justify="center">
	<p>... Initializing ...</p>
      </v-col>
    </v-row>
  </div>
  <div v-else-if="ACTIVE_PANEL == 'startPanel'">
    <StartPanel />
  </div>
  <div v-else-if="ACTIVE_PANEL == 'accountPanel'">
    <AccountPanel />
  </div>
  <div v-else-if="ACTIVE_PANEL == 'newMatchPanel'">
    <NewMatchPanel />
  </div>
</v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
    computed: {
	...mapState('sessionStorage', ['CLIENT_EXISTS', 'ACTIVE_PANEL']),
    },
    
    mounted() {
	if (!this.CLIENT_EXISTS) {
	    this.SET_ACTIVE_PANEL('startPanel');
	} else {
	    this.SET_ACTIVE_PANEL('accountPanel');
	    this.TOGGLE_LOCK_BUTTON(true);
	}
    },
    
    methods: {
	...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL',
					   'TOGGLE_LOCK_BUTTON']),
    },
};
</script>
