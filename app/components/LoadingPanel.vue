<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" align="center" justify="center">
        <v-progress-circular indeterminate />
      </v-col>
      <v-col cols="12" align="center" justify="center">
        <h2>... {{ loadingText }} ...</h2>
      </v-col>
        <v-col cols="12" align="center" justify="center" class="pt-0 mt-0">
          <div v-if="warning">
            <span style="color: red;"><h4>This appears to be taking longer than usual.</h4></span>
          </div>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    props: ['loadingText', 'warningTime'],

    data () {
        return {
            warning: false
        }
    },
    
    mounted() {
        this.warning = false;
        this.timeSubscription();
    },
    
    methods: {
        timeSubscription () {
            let timer;
            timer = setTimeout(this.toggleWarning, this.warningTime);
        },
        toggleWarning () {
            this.warning = true;
        }
    }
}
</script>
