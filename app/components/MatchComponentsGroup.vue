<template>
<div class="content-spaced-small">
  <v-row>
    <v-col xs="12" sm="12" md="6" lg="6" xl="6" align="center" justify="center">
      <GamePanel />
    </v-col>
    <v-col xs="12" sm="12" md="6" lg="6" xl="6">
      <ChatPanel />
    </v-col>
  </v-row>
</div>
</template>

<script>
import { mapActions } from 'vuex';
  
export default {
    props: ['topicId'],
    
    mounted() {
        this.$nextTick(function () {
            this.SUBSCRIBE_TO_TOPIC(this.topicId)
        })
    },

    methods: {
        ...mapActions('sessionStorage', ['SUBSCRIBE_TO_TOPIC'])
    }
}
</script>
