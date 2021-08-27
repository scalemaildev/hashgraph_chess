<template>
<v-container>
  Test
</v-container>
</template>

<script>
import { mapActions } from 'vuex';

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
    computed: {
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
