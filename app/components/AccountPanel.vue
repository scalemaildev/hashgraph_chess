<template>
<v-container class="content-body">
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <h1>Welcome, <i>#{{ this.$store.state.sessionStorage.accountId }}</i></h1>
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
export default {
    methods: {
	createNewMatch() {
	    this.$store.commit('setActivePanel', 'newMatchPanel');
	},
    },
}
</script>
