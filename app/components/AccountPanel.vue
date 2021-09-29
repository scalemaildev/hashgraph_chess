<template>
<v-container class="content-body">
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <h1>Welcome, <i>#{{ ACCOUNT_ID }}</i></h1>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <p>From this panel you can either create a new chess match or join an existing one.</p>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-btn block @click="createNewMatch">
        New Match
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-btn block @click="joinMatch">
        Join Match
      </v-btn>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
  
export default {
    computed: {
        ...mapState('sessionStorage', ['ACCOUNT_ID']),
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL']),
        createNewMatch() {
            this.SET_ACTIVE_PANEL('newMatchPanel');
        },
        joinMatch() {
            this.SET_ACTIVE_PANEL('joinMatchPanel');
        }
    },
}
</script>
