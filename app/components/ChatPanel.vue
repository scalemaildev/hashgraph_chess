<template>
<v-container fluid class="content-body-right">
  <h2>Chatbox</h2>
  {{ matchMessages }}
</v-container>  
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['topicId'],

    computed: {
        ...mapGetters('sessionStorage', ['MATCH_MESSAGES']),
        matchMessages () {
            return this.MATCH_MESSAGES(this.topicId);
        },
    },

    methods: {
    },
}
</script>
