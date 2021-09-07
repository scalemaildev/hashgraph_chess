<template>
<div>
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <v-container fluid class="match-header">
	<h1>Match ID: {{ this.topicId }}</h1>
      </v-container>
    </v-col>
  </v-row>
  <div v-if="clientSet">
    We're good
  </div>
  <v-container v-else class="content-body-hightop">
    <v-row align="center" justify="center">
      <v-col cols="12" align="center" justify="center">
	<span style="color: red;"><h3>No Hashgraph Client Initialized</h3></span>
	<p style="color: red;">You must initialize the hashgraph client with your Account ID and Private Key before subscribing to a match.</p>
      </v-col>
    </v-row>
    <InitClientForm />
  </v-container>
</div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
    async asyncData({ params }) {
	const topicId = params.slug;
	return { topicId }
    },
    
    data () {
	return {
	    socket: this.$root.mainSocket,
	    subscribed: false,
	    subscriptionError: false,
	}
    },
    
    computed: {
	clientSet () {
	    return this.$store.state.sessionStorage.clientExists;
	},
	accountId () {
	    return this.$store.state.sessionStorage.accountId;
	},
	topicMessages () {
	    return this.$store.state.messages[this.topicID];
	},
	
    },
    
    mounted() {
	if (this.clientSet) {
	    this.subscribeToTopic()
	} else {
	    this.$root.mainSocket = this.$nuxtSocket({
		name: 'main',
		persist: 'mainSocket',
		reconnection: false
	    })
	}
    },
    
    methods: {
	async subscribeToTopic() {
	    console.log('Subscribing to topic ' + this.topicID + '...');
	    try {
		this.socket.emit('subscribeToTopic', {
		    'topicId': this.topicId
		});
	    } catch (error) {
		console.error(error);
		this.subscriptionError = true;
		return -1;
	    }
	    this.subscribed = true;
	}
    },
}
</script>
