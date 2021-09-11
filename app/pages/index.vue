<template>
<div>
  <div v-show="ACTIVE_PANEL == 'loadingPanel'" class="content-spaced-mid">
    <v-row>
      <v-col cols="12" align="center" justify="center">
	<v-progress-circular indeterminate />
      </v-col>
      <v-col cols="12" align="center" justify="center">
	<p>... LOADING ...</p>
      </v-col>
    </v-row>
  </div>
  <div v-show="ACTIVE_PANEL == 'startPanel'">
    <StartPanel />
  </div>
  <div v-show="ACTIVE_PANEL == 'accountPanel'">
    <AccountPanel />
  </div>
  <div v-show="ACTIVE_PANEL == 'newMatchPanel'">
    <NewMatchPanel />
  </div>
  <div v-show="ACTIVE_PANEL == 'joinMatchPanel'">
    <JoinMatchPanel />
  </div>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
    computed: {
	...mapState('sessionStorage', ['CLIENT_EXISTS', 'ACTIVE_PANEL']),
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
	startup() {
	    if (!this.CLIENT_EXISTS) {
		this.SET_ACTIVE_PANEL('startPanel');
	    } else {
		this.SET_ACTIVE_PANEL('accountPanel');
		this.TOGGLE_LOCK_BUTTON(true);
	    }
	},
    },
};
</script>
