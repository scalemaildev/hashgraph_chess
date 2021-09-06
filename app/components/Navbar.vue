<template>
<v-toolbar color="rgba(18, 32, 59, 0.8);">
  <v-toolbar-title class="navbar-backing">
    <h2 style="display: inline">♄ashgraph Chess</h2>
  </v-toolbar-title>
  <v-spacer />
  <v-btn>
    Lock
  </v-btn>
</v-toolbar>
</template>

<script>
export default {
    computed: {
	clientSet () {
	    return this.$store.state.sessionStorage.hashgraphClient;
	}
    }
}
</script>

<style scoped>
.v-toolbar {
    color: #e0e0e0;
}
</style>
