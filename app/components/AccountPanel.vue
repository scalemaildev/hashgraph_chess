<template>
<v-container class="content-body">
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <h1>Welcome, <i>#{{ accountId }}</i></h1>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <v-btn block @click="createNewMatch">
	New Match
      </v-btn>
    </v-col>
    <v-col cols="12" align="center" justify="center">
      <v-btn block>
	Join Match
      </v-btn>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import { mapMutations } from 'vuex';
  
export default {
    computed: {
	accountId () {
	    return this.$store.state.sessionStorage.ACCOUNT_ID;
	}
    },
    
    methods: {
	...mapMutations([
	    'SET_ACTIVE_PANEL'
	]),
	createNewMatch() {
	    this.SET_ACTIVE_PANEL('newMatchPanel');
	},
    },
}
</script>
