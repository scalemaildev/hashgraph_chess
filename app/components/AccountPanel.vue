<template>
<v-container class="content-body">
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <h1>Welcome, #{{ this.$store.state.accountId }}</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-spacer />
    <v-col cols="12" align="center" justify="center">
      <v-btn>
	New Match
      </v-btn>
    </v-col>
    <v-col cols="12" align="center" justify="center">
      <v-btn>
	Resume
      </v-btn>
    </v-col>
    <v-spacer />
  </v-row>
</v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
	...mapActions([
	    'asyncEmit'
	]),
    },
}
</script>
