<template>
<v-container>
  Messages Window
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
