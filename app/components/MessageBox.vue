<template>
<v-container no-gutters class="chatPanel-box">
  <div class="d-flex flex-row align-center">
    <v-text-field v-model="chatMessage" placeholder="Enter chat message here..." @keypress.enter="sendMessage()"></v-text-field>
    <v-btn class="ml-4" @click="sendMessage()">Send</v-btn>
  </div>
</v-container>
</template>

<script>
import { mapActions } from 'vuex';
  
export default {
    props: ['topicId'],
    
    data() {
        return {
            chatMessage: "",
        }
    },
    
    methods: {
        ...mapActions('sessionStorage', ['SEND_MESSAGE']),
        async sendMessage() {
            let messagePayload = {
	        messageType: 'chatMessage',
                topicId: this.topicId,
	        message: this.chatMessage
            };
            
            await this.SEND_MESSAGE(messagePayload);
            this.chatMessage = "";
        }
    },
}
</script>
