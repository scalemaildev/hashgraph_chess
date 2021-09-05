<template>
<v-container>
  <div v-if="activePanel == 'startPanel'">
    <StartPanel />
  </div>
  <div v-else="activePanel == 'accountPanel'">
    <AccountPanel />
  </div>
</v-container>
</template>

<script>
export default {
    computed: {
	activePanel () {
	    return this.$store.state.activePanel
	},
    },
    mounted() {
	console.log(this.$store.state.sessionStorage.accountId)
	this.$root.mainSocket = this.$nuxtSocket({
	    name: 'main',
	    persist: 'mainSocket',
	    reconnection: false
	})
    },
};
</script>
