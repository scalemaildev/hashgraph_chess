<template>
<div>
  <v-row no-gutters>
    <v-col>
      <div class="d-flex flex-row align-center">
        <v-text-field v-model="chatMessage" placeholder="Enter text here..." @keypress.enter="sendMessage()"></v-text-field>
        <v-btn class="ml-4" @click="sendMessage()">Send</v-btn>
      </div>
    </v-col>
  </v-row>
</div>
</template>

<script>
export default {
    props: ['topicId'],
    
    data() {
        return {
            chatMessage: "",
        }
    },
    
    methods: {
        sendMessage() {
            let messagePayload = {
	        messageType: 'chatMessage',
	        message: this.chatMessage
            };
            
            console.log(this.chatMessage);
      this.chatMessage = "";
    }
  },
}
</script>
