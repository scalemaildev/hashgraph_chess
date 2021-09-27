<template>
<div class="text-center">
  <v-dialog
    v-model="dialog"
    max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on">
        Resign 
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Resign Confirmation
      </v-card-title>
      
      <v-card-text>
        Resign from this game?
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions>
        <v-btn
          color="primary"
          text
          @click="dialog = false"
          >
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="submitResign()"
          >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import { mapActions } from 'vuex';
  
export default {
    props: ['topicId'],
    
    data () {
        return {
            dialog: false,
        }
    },
    
    methods: {
        ...mapActions('sessionStorage', ['SEND_MESSAGE']),
        submitResign() {
            let messagePayload = {
	        messageType: 'resignPlayer',
                topicId: this.topicId
            };
            const response = await this.SEND_MESSAGE(messagePayload);
            
            this.dialog = false;
        }
    }
}
</script>
