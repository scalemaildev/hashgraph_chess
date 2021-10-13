<template>
<v-app dark>
  <v-main class="main-layout" v-bind:class="mobileLayout">
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
        mobileLayout() {
            return this.isMounted && this.$vuetify.breakpoint.xs ? "mobile" : ""
        }
    }
}
</script>
