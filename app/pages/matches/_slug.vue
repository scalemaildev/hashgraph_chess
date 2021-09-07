<template>
  <div>
    <v-row>
      <v-col cols="12" align="center" justify="center">
	<v-container fluid class="match-header">
	  <h1>Match ID: {{ this.topicId }}</h1>
	</v-container>
      </v-col>
    </v-row>
    <v-row>
      <v-col xs="12" sm="12" md="6" lg="6" xl="6" align="center" justify="center">
	<v-container fluid class="content-body-left">
	  <h2>Chess Game</h2>
	</v-container>
      </v-col>
      <v-col xs="12" sm="12" md="6" lg="6" xl="6">
	<v-container fluid class="content-body-right">
	  <h2>Chatbox</h2>
	</v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
    async asyncData({ params }) {
	const topicId = params.slug;
	return { topicId }
    },
    
    computed: {
    },
    
    methods: {
    },
}
</script>
