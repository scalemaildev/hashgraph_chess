<template>
<v-app dark>
  <v-main class="main-layout" v-bind:class="mobileLayout">
    <Navbar />
    <Nuxt />
  </v-main>
</v-app>
</template>

<script>
import { mapMutations } from 'vuex';
  
export default {
    data: () => {
        return {
            isMounted: false
        }
    },
    
    watch: {
        mobileLayout (newDisplay, oldDisplay) {
            if (newDisplay == "mobile") {
                this.TOGGLE_SMALL_SCREEN(true);
            } else {
                this.TOGGLE_SMALL_SCREEN(false);
            }
        }
    },
    
    mounted() {
        this.isMounted = true;
    },
    
    computed: {
        mobileLayout() {
            return this.isMounted && this.$vuetify.breakpoint.xs ? "mobile" : ""
        }
    },
    
    methods: {
        ...mapMutations(['TOGGLE_SMALL_SCREEN']),
    }
}
</script>
