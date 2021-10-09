<template>
<v-toolbar color="rgba(18, 32, 59, 0.8);" class="navbar-wrapper">
  <v-toolbar-title class="navbar-backing">
    <h2 style="display: inline">Hashgraph Chess</h2> <sup>Beta</sup>
  </v-toolbar-title>
  <v-spacer />
  <v-btn v-show="LOCK_BUTTON" @click="unsetClient">
    Lock
  </v-btn>
</v-toolbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
  
export default {
    computed: {
        ...mapState('sessionStorage', ['LOCK_BUTTON'])
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['UNSET_CLIENT']),
        unsetClient() {
            this.UNSET_CLIENT();
            this.$router.push('/');
        }
    },
}
</script>

<style scoped>
.v-toolbar {
    color: #e0e0e0;
}
</style>
