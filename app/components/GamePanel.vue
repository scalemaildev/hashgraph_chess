<template>
<v-container class="gamePanel-wrapper">
  <v-row>
    <v-col align="center" justify="center">
      <h3>Board Goes Here</h3>
    </v-col>
  </v-row>
  <v-row>
    <v-col align="center">
      <h3>Information Goes Here</h3>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Chess from 'chess.js';

export default {
    props: ['topicId'],
    
    data () {
        return {
            game: null
        }
    },
    
    computed: {
        ...mapGetters('sessionStorage', ['MATCH_MOVES']),
        matchMoves () {
            return this.MATCH_MOVES(this.topicId);
        },
        boardState () {
        },
    },

    created () {
        this.game = new Chess();
    },

    mounted () {
    },

    methods: {
    },
}
</script>
