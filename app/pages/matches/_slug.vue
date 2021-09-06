<template>
<v-container fluid class="content-body">
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <h2>Match ID: {{ this.topicId }}</h2>
    </v-col>
  </v-row>
</v-container>
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
