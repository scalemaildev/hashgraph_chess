<template>
<v-container class="chatPanel-window">
  <ul v-chat-scroll style="list-style-type: none; padding-left: 0;">
    <li v-for="msg in matchMessages">
      <strong>{{ msg.account }}:</strong> {{ msg.message }}
    </li>
  </ul>
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
