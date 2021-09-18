<template>
<v-container class="gamePanel-wrapper">
  <v-row>
    <v-col align="center" justify="center">
      <v-row no-gutters>
        <v-col>
          {{ translatedGameState[0][0] }}
          {{ translatedGameState[0][1] }}
          {{ translatedGameState[0][2] }}
          {{ translatedGameState[0][3] }}
          {{ translatedGameState[0][4] }}
          {{ translatedGameState[0][5] }}
          {{ translatedGameState[0][6] }}
          {{ translatedGameState[0][7] }}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          {{ translatedGameState[1][0] }}
          {{ translatedGameState[1][1] }}
          {{ translatedGameState[1][2] }}
          {{ translatedGameState[1][3] }}
          {{ translatedGameState[1][4] }}
          {{ translatedGameState[1][5] }}
          {{ translatedGameState[1][6] }}
          {{ translatedGameState[1][7] }}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          {{ translatedGameState[2][0] }}
          {{ translatedGameState[2][1] }}
          {{ translatedGameState[2][2] }}
          {{ translatedGameState[2][3] }}
          {{ translatedGameState[2][4] }}
          {{ translatedGameState[2][5] }}
          {{ translatedGameState[2][6] }}
          {{ translatedGameState[2][7] }}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          {{ translatedGameState[3][0] }}
          {{ translatedGameState[3][1] }}
          {{ translatedGameState[3][2] }}
          {{ translatedGameState[3][3] }}
          {{ translatedGameState[3][4] }}
          {{ translatedGameState[3][5] }}
          {{ translatedGameState[3][6] }}
          {{ translatedGameState[3][7] }}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          {{ translatedGameState[4][0] }}
          {{ translatedGameState[4][1] }}
          {{ translatedGameState[4][2] }}
          {{ translatedGameState[4][3] }}
          {{ translatedGameState[4][4] }}
          {{ translatedGameState[4][5] }}
          {{ translatedGameState[4][6] }}
          {{ translatedGameState[4][7] }}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          {{ translatedGameState[5][0] }}
          {{ translatedGameState[5][1] }}
          {{ translatedGameState[5][2] }}
          {{ translatedGameState[5][3] }}
          {{ translatedGameState[5][4] }}
          {{ translatedGameState[5][5] }}
          {{ translatedGameState[5][6] }}
          {{ translatedGameState[5][7] }}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          {{ translatedGameState[6][0] }}
          {{ translatedGameState[6][1] }}
          {{ translatedGameState[6][2] }}
          {{ translatedGameState[6][3] }}
          {{ translatedGameState[6][4] }}
          {{ translatedGameState[6][5] }}
          {{ translatedGameState[6][6] }}
          {{ translatedGameState[6][7] }}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          {{ translatedGameState[7][0] }}
          {{ translatedGameState[7][1] }}
          {{ translatedGameState[7][2] }}
          {{ translatedGameState[7][3] }}
          {{ translatedGameState[7][4] }}
          {{ translatedGameState[7][5] }}
          {{ translatedGameState[7][6] }}
          {{ translatedGameState[7][7] }}
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
                0: ['','','','','','','',''], //row 8
                1: ['','','','','','','',''],
                2: ['','','','','','','',''],
                3: ['','','','','','','',''],
                4: ['','','','','','','',''],
                5: ['','','','','','','',''],
                6: ['','','','','','','',''],
                7: ['','','','','','','',''] // row 1
            }
        }
    },
    
    computed: {
        ...mapGetters('sessionStorage', ['MATCH_MOVES']),
        matchMoves () {
            return this.MATCH_MOVES(this.topicId);
        },
        gameState () {
            if (!!this.game) {
                return this.game.board();
            }
        },
    },
    
    watch: {
        gameState (newGameState, oldGameState) {
            this.translateGameState(newGameState);
        },
    },
    
    created () {
        this.game = new Chess();
        this.translateGameState(this.game.board());
    },
    
    mounted () {
    },
    
    methods: {
        translateGameState (gameState) {
            for (let row = 0; row < gameState.length; row++) {
                for (let col = 0; col < gameState[row].length; col++) {
                    if (!!gameState[row][col]) {
                        let type = gameState[row][col].type;
                        let color = gameState[row][col].color;
                        
                        if (color == 'w') {
                            // replace the piece in its  row/col
                        } else if (color == 'b') {
                            // upcase the piece and push to the row/col
                        }
                    } else {
                        this.translatedGameState[row][col] = this.findBaseTileImageName(row, col);
                    }
                }
            }
        },
        findBaseTileImageName (row, col) {
            let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            let letter = letters[col];
            let number = row + 1;
            
            let baseTileImageName = '../static/board/' + letter + number + ".png";
            return baseTileImageName;
        },
        gameHistory () {
            return this.game.history();
        },
    }
}
</script>
