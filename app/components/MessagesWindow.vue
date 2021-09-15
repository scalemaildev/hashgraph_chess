<template>
<v-container v-chat-scroll="{always: false, smooth: true}">
    <div v-for="msg in matchMessages">
      <strong>{{ msg.account }}:</strong> {{ msg.message }}
    </div>
</v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: ['topicId'],
    
    computed: {
        ...mapGetters('sessionStorage', ['MATCH_MESSAGES']),
        matchMessages () {
            return this.MATCH_MESSAGES(this.topicId);
        },
    }
}
</script>
