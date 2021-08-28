<template>
<v-container class="content-body">
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <h2>Welcome to Hashgraph Chess.</h2>
      <h3>You can resume a match in-progress, or begin a new one.</h3>
    </v-col>
  </v-row>
  <v-row align="center" justify="center">
    <v-col cols="12" align="center">
      <v-btn
	@click="resumeGame()"
	>
	<h3>Resume Match</h3>
      </v-btn>
    </v-col>
    <v-col cols="12" align="center">
      <v-btn
	@click="newGame()">
	<h3>New Match</h3>
      </v-btn>
    </v-col>
  </v-row>
</v-container>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
    data() {
	return {
	    topicId: "",
	    rules: {
		topicId: value => {
		    const pattern = /0.0.[0-9]{3,}/
		    return pattern.test(value) || "Topic Id should look like 0.0.xxx"
		}
	    }
	}
    },
    methods: {
	...mapMutations([
	    'toggleStateFlag',
	]),
	...mapActions([
	    'asyncEmit'
	]),    
	resumeGame() {
	    this.toggleStateFlag({
		flagName: 'topicId',
		bool: true})
	},        
	newGame() {
	},
    },
}
</script>
