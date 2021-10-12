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
    computed: {
        mainLayoutSize() {
            return this.$vuetify.breakpoint.xs ? "main-layout-mobile" : "main-layout"
        }
    }
}
</script>
