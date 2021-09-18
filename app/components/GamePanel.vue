<template>
<v-container class="gamePanel-wrapper">
  <v-row>
    <v-col align="center" justify="center">
      <v-row no-gutters>
        <v-col>
          {{ translatedGameState['row8'][0] }}
          {{ translatedGameState['row8'][1] }}
          {{ translatedGameState['row8'][2] }}
          {{ translatedGameState['row8'][3] }}
          {{ translatedGameState['row8'][4] }}
          {{ translatedGameState['row8'][5] }}
          {{ translatedGameState['row8'][6] }}
          {{ translatedGameState['row8'][7] }}
        </v-col>
      </v-row>
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
                row8: ['_','_','_','_','_','_','_','_'],
                row7: ['_','_','_','_','_','_','_','_'],
                row6: ['_','_','_','_','_','_','_','_'],
                row5: ['_','_','_','_','_','_','_','_'],
                row4: ['_','_','_','_','_','_','_','_'],
                row3: ['_','_','_','_','_','_','_','_'],
                row2: ['_','_','_','_','_','_','_','_'],
                row1: ['_','_','_','_','_','_','_','_']
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
                            // replace the piece in its  row/col
                        } else if (color == 'b') {
                            // upcase the piece and push to the row/col
                        }
                    } else {
                        // push a _ to the row/col
                    }
                }
            }
        },
        findBaseTileColor (row, col) {
            // find blue or white for this tile
        },
        findBaseTileImage (row, col) {
            // find the image for blank tile with this row/col
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
