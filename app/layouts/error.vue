<template>
<v-app dark>
  <v-main class="text-center" v-bind:class="mainLayoutSize">
    <v-container class="content-body">
      <v-row class="content-padded">
        <v-col>
          <h1 v-if="error.statusCode === 404">
            {{ pageNotFound }}
          </h1>
          <h1 v-else>
            {{ otherError }}
          </h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <NuxtLink to="/">
            Home page
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</v-app>
</template>

<script>
export default {
    layout: 'empty',
    
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    
    data () {
        return {
            pageNotFound: '404 Not Found',
            otherError: 'An error occurred',
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
    },
    
    head () {
        const title =
              this.error.statusCode === 404 ? this.pageNotFound : this.otherError
        return {
            title
    }
  }
}
</script>

<style scoped>
h1 {
    font-size: 40px;
}
</style>
