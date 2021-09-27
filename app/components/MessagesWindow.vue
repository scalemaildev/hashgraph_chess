<template>
<v-container class="chatPanel-window">
  <ul v-chat-scroll style="list-style-type: none; padding-left: 0;">
    <li v-for="msg in matchMessages">
      <div v-if="msg.account == playerWhite">
        <strong><span style='color: #b6b4d6;'>{{ msg.account }}:</span></strong> {{ msg.message }}
      </div>
      <div v-else-if="msg.account == playerBlack">
        <strong><span style='color: #747294;'>{{ msg.account }}:</span></strong> {{ msg.message }}
      </div>
      <div v-else>
        <strong>{{ msg.account }}:</strong> {{ msg.message }}
      </div>
    </li>
  </ul>
</v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: ['topicId'],

    data () {
        return {
            playerWhite: '',
            playerBlack: ''
        }
    },

    created () {
        this.assignPlayers();
    },
    
    computed: {
        ...mapGetters('sessionStorage', ['MATCH_DATA',
                                         'MATCH_MESSAGES']),
        matchMessages () {
            return this.MATCH_MESSAGES(this.topicId);
        },
    },

    methods: {
        assignPlayers() {
            this.playerWhite = this.MATCH_DATA(this.topicId).playerWhite;
            this.playerBlack = this.MATCH_DATA(this.topicId).playerBlack;
        }
    }
}
</script>
