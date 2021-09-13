<template>
<v-app dark>
  <v-main class="main-layout">
    <Navbar />
    <Nuxt />
  </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
  
export default {
    mounted () {
        this.$root.mainSocket = this.$nuxtSocket({
            name: 'main',
            persist: 'mainSocket',
            reconnection: false
        });
    }
}  
</script>
