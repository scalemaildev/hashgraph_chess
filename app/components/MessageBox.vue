<template>
<v-container>
  Message Box
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
            
            const response = await this.SEND_MESSAGE(messagePayload);
            this.chatMessage = "";
        }
    },
}
</script>
