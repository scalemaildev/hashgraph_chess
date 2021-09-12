<template>
<div>
  <div v-if="subscribing" class="content-spaced-mid">
    <v-row>
      <v-col cols="12" align="center" justify="center">
        <v-progress-circular indeterminate />
      </v-col>
      <v-col cols="12" align="center" justify="center">
        <p>... SUBSCRIBING ...</p>
      </v-col>
    </v-row>
  </div>
  <div v-else class="content-spaced-small">
    <v-row>
      <v-col xs="12" sm="12" md="6" lg="6" xl="6" align="center" justify="center">
        <GamePanel />
      </v-col>
      <v-col xs="12" sm="12" md="6" lg="6" xl="6">
        <ChatPanel />
      </v-col>
    </v-row>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    props: ['topicId'],
    
    data () {
        return {
            subscribing: true
        }
    },
    
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
