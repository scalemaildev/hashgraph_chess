<template>
<v-container no-gutters class="chatPanel-box">
    <div v-show="!isObserver">
      <div class="d-flex flex-row align-center">
        <v-text-field v-model="chatMessage" placeholder="Enter chat message here..." @keypress.enter="sendMessage()"></v-text-field>
        <v-btn class="ml-4" @click="sendMessage()">Send</v-btn>
      </div>
    </div>
</v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
  
export default {
    props: ['topicId'],
    
    data() {
        return {
            chatMessage: "",
        }
    },

    computed: {
        ...mapState('sessionStorage', ['ACCOUNT_ID']),
        ...mapGetters('sessionStorage', ['MATCH_DATA']),
        isObserver() {
            let playerList = [this.MATCH_DATA(this.topicId).playerWhite, this.MATCH_DATA(this.topicId).playerBlack];
            
            return !playerList.includes(this.ACCOUNT_ID);
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
