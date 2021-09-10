<template>
<div>
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <v-container fluid class="match-header">
	<h1>Match ID: {{ this.topicIdString }}</h1>
      </v-container>
    </v-col>
  </v-row>
  <v-container v-if="!clientSet" class="content-body-hightop">
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
	const topicIdString = params.slug;
	return { topicIdString }
    },
    
    data () {
	return {
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
    },

    created() {
	if (this.clientSet) {
	    console.log('Subscribing to topic ' + this.topicIDString + '...');
	    this.subscribeToTopic()
	}
    },
    
    methods: {
    },
}
</script>
