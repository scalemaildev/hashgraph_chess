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
        <div v-show="submitting">
          <LoadingPanel loadingText="SUBMITTING"
                        warningTime=12000 />
        </div>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions>
        <v-btn
          color="primary"
          text
          @click="dialog = false">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click.prevent="submitResign()">
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
            submitting: false,
            submitError: false
        }
    },
    
    methods: {
        ...mapActions('sessionStorage', ['SEND_MESSAGE']),
        async submitResign() {
            this.submitting = true;
            
            let messagePayload = {
	        messageType: 'resignPlayer',
                topicId: this.topicId
            };
            
            const response = await this.SEND_MESSAGE(messagePayload);

            if (response.success) {
                this.dialog = false;
            } else {
                this.submitError = true;
            }
        }
    }
}
</script>
