<template>
<div>
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <v-container fluid class="match-header">
	<h1>Match ID: {{ this.topicIdString }}</h1>
      </v-container>
    </v-col>
  </v-row>
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
	}
    },
    
    computed: {
	...mapState('sessionStorage', ['CLIENT_EXISTS',
				       'ACCOUNT_ID',
				      'MATCHES']),
	topicData () {
	    return this.MATCHES[this.topicIdString]
	}
    },
    
    mounted() {
    },
    
    created() {
    },
    
    methods: {
    },
}
</script>
