<template>
<div>
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <v-container fluid class="match-header">
	<h1>Match ID: {{ this.topicId }}</h1>
      </v-container>
    </v-col>
  </v-row>
  <div v-if="!subscribed && !subscriptionError" class="content-spaced-small">
    <v-row>
      <v-col cols="12" align="center" justify="center">
	<v-progress-circular
	  indeterminate
	  />
      </v-col>
      <v-col cols="12" align="center" justify="center">
	... Subscribing ...
      </v-col>
    </v-row>    
  </div>
  <div v-if="subscribed && !subscriptionError">
    <v-row>
      <v-col xs="12" sm="12" md="6" lg="6" xl="6" align="center" justify="center">
	<GamePanel />
      </v-col>
      <v-col xs="12" sm="12" md="6" lg="6" xl="6">
	<ChatPanel />
      </v-col>
    </v-row>
  </div>
  <div v-if="subscriptionError">
    <v-row align="center" justify="center">
      <v-col cols="12" align="center" justify="center">
	<span style="color: red;"><h3>An error occurred while subscribing to the match:</h3></span>
	<p style="color: red;">Double check the match ID. Extremely old matches may no longer be available.</p>
      </v-col>
    </v-row>
  </div>
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
	    socket: this.window.$nuxt.$root.mainSocket,
	    subscribed: false,
	    subscriptionError: false,
	    messages: {},
	}
    },

    computed: {
	clientSet () {
	    return this.$store.state.sessionStorage.clientExists;
	},
	accountId () {
	    return this.$store.state.sessionStorage.accountId;
	},
	messages () {
	    return this.$store.state.messages[this.topicID];
	},
	
    },

    mounted() {
	this.subscribeToTopic()
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
