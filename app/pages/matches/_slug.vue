<template>
<div>  
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <v-container fluid class="match-header">
	<h1>Match ID: {{ this.topicIdString }}</h1>
      </v-container>
    </v-col>
  </v-row>
  <div v-show="!subscribed" class="content-spaced-mid">
    <v-row>
      <v-col cols="12" align="center" justify="center">
	<v-progress-circular indeterminate />
      </v-col>
      <v-col cols="12" align="center" justify="center">
	<p>... SUBSCRIBING TO TOPIC ...</p>
      </v-col>
    </v-row>
  </div>
  <div v-show="subscriptionError" class="content-spaced-mid">    
    <v-row align="center" justify="center">
      <v-col cols="12" align="center" justify="center">
	<span style="color: red;"><h3>An error occurred subscribing to this topic</h3></span>
	<p style="color: red;">Double check the Topic ID and see the console log for potential details.</p>
      </v-col>
    </v-row>
  </div>
  <div v-show="subscribed">
    Subscribed!
  </div>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    async asyncData({ params }) {
	const topicIdString = params.slug;
	
	return { topicIdString }
    },
    
    data () {
	return {
	    subscribed: false,
	    subscriptionError: false
	}
    },
    
    computed: {
	...mapState('sessionStorage', ['CLIENT_EXISTS',
				       'ACCOUNT_ID',
				       'MATCHES']),
    },
    
    mounted() {
	this.SUBSCRIBE_TO_TOPIC(this.topicIdString);
    },
    
    created() {
    },
    
    methods: {
	...mapActions('sessionStorage', ['SUBSCRIBE_TO_TOPIC'])
    },
}
</script>
