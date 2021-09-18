<template>
<v-container class="gamePanel-wrapper">
  <v-row>
    <v-col align="center" justify="center">
      {{ gameState }}
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
            game: null,
            translatedGameState: {
                row0: ['_','_','_','_','_','_','_','_'],
                row1: ['_','_','_','_','_','_','_','_'],
                row2: ['_','_','_','_','_','_','_','_'],
                row3: ['_','_','_','_','_','_','_','_'],
                row4: ['_','_','_','_','_','_','_','_'],
                row5: ['_','_','_','_','_','_','_','_'],
                row6: ['_','_','_','_','_','_','_','_'],
                row7: ['_','_','_','_','_','_','_','_']
            },
        }
    },
    
    computed: {
        ...mapGetters('sessionStorage', ['MATCH_MOVES']),
        matchMoves () {
            return this.MATCH_MOVES(this.topicId);
        },
        gameState () {
            let stateArray = this.game.board();

            for (let row = 0; row < stateArray.length; row++) {
                for (let col = 0; col < stateArray[row].length; col++) {
                    if (!!stateArray[row][col]) {
                        let type = stateArray[row][col].type;
                        let color = stateArray[row][col].color;

                        if (color == 'w') {
                            // push the piece to the row/col
                        } else if (color == 'b') {
                            // upcase the piece and push to the row/col
                        }
                    } else {
                        // push a _ to the row/col
                    }
                }
            }
        },
        gameHistory () {
            return this.game.history();
        }
        
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
