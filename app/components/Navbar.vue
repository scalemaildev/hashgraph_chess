<template>
<v-toolbar color="rgba(18, 32, 59, 0.8);" class="navbar-wrapper">
  <v-toolbar-title class="navbar-backing">
    <h2 style="display: inline">♄ashgraph Chess</h2> <sup>Pre-Beta</sup>
  </v-toolbar-title>
  <v-spacer />
  <v-btn v-if="clientSet" @click="unsetClient">
    Lock
  </v-btn>
</v-toolbar>
</template>

<script>
export default {
    computed: {
	clientSet () {
	    return this.$store.state.sessionStorage.LOCK_BUTTON;
	}
    },
    
    methods: {
	unsetClient() {
	    this.$store.dispatch('sessionStorage/UNSET_CLIENT', {});
	    this.$router.push('/');
	}
    },
}
</script>

<style scoped>
.v-toolbar {
    color: #e0e0e0;
}
</style>
