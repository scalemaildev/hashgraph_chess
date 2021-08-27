<template>
<v-container>
  <div v-if="!topicSet && !topicQuerying">
    <StartPanel />
  </div>
  <div v-else>
    Main Panels Go Here
  </div>
</v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    computed: {
	topicQuerying () {
	    return this.$store.state.topicQuerying
	},
	topicSet () {
	    return this.$store.state.topicSet
	},
	mirrorSubbed () {
	    return this.$store.state.mirrorSubbed
	}
    },
    mounted() {
	this.$root.mainSocket = this.$nuxtSocket({
	    name: 'main',
	    persist: 'mainSocket',
	    reconnection: false
	})
	this.initHederaClient()
    },
    methods: {
	...mapActions([
	    'asyncEmit'
	]),
	async initHederaClient () {
	    const result = await this.asyncEmit({
		'eventName': 'initHashgraphClient'
	    });
	    console.log(result);
	},
    }
};
</script>
