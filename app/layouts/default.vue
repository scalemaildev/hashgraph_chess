<template>
<v-app dark>
  <v-main v-bind:class="mainLayoutSize">
    <Navbar />
    <Nuxt />
  </v-main>
  </v-app>
</template>

<script>
export default {
    data: () => {
        return {
            isMounted: false
        }
    },
    
    mounted() {
        this.isMounted = true;
    },
    
    computed: {
        mainLayoutSize() {
            return this.isMounted && this.$vuetify.breakpoint.xs ? "main-layout-mobile" : "main-layout"
        }
    }
}
</script>
