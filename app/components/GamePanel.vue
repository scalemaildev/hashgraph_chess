<template>
<v-container fluid class="gamePanel-wrapper">
  chess board
</v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
  
export default {
    props: ['topicId'],
    
    computed: {
        ...mapGetters('sessionStorage', ['MATCH_MOVES']),
        matchMoves () {
            return this.MATCH_MOVES(this.topicId);
        },
    },
}
</script>
