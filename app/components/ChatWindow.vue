<template>
<div>
  <v-row align="end">
    <v-col>
      <div v-for="msg in matchMessages">
	<strong>{{ msg.account }}:</strong> {{ msg.message }}
      </div>
    </v-col>
  </v-row>
</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: ['topicId'],
    
    computed: {
        ...mapGetters('sessionStorage', ['MATCH_MESSAGES']),
        matchMessages () {
            return this.MATCH_MESSAGES(this.topicId);
        },
    }
}
</script>
