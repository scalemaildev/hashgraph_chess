<template>
<v-container class="content-body">
  <v-row>
    <v-col cols="12" align="center" justify="center">      
      <h3>Enter Testnet Account Information:</h3>
    </v-col>
  </v-row>
</v-container>  
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
    data() {
	return {
	    topicId: "",
	    rules: {
		accountId: value => {
		    const pattern = /0.0.[0-9]{3,}/
		    return pattern.test(value) || "Account ID should look like 0.0.xxx"
		}
	    }
	}
    },
    methods: {
	...mapMutations([
	    'toggleStateFlag',
	]),
    },
}
</script>
