<template>
<v-container>
  <div v-if="activePanel == 'startPanel'">
    <StartPanel />
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
	this.$root.mainSocket = this.$nuxtSocket({
	    name: 'main',
	    persist: 'mainSocket',
	    reconnection: false
	})
    },
};
</script>
