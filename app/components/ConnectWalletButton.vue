<template>
<div>
  <v-row>
    <v-col align="center">
      <v-btn @click.prevent="initHashConnect">
        Connect HashPack Wallet
      </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col align="center" justify="center" class="pt-0 mt-0">
      <div v-if="connectError">
        <span style="color: red;"><h4>An error occurred connecting to HashPack wallet extension.</h4></span>
      </div>
    </v-col>
  </v-row>
</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {

    
    methods: {

    }
}
</script>
