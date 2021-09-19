<template>
  <v-container fluid class="gamePanel-wrapper">
    <v-row no-gutters align="center" class="flex-column d-flex">
      <img :src="require(`~/assets/game/border_top.png`)" class="gameBoard-horz">
      <div class="d-flex" style="position: relative">
          <img :src="require(`~/assets/game/border_left_legend.png`)" class="gameBoard-vert">
        <div v-for="col in 8" :key="col">
          <div v-for="row in 8" :key="row">
            <div
              :style="{
                      width: '40px',
                      height: '40px',
                      }"
              >
              <img :src="getTile(row,col)" class="tileImage">
            </div>
          </div>  
        </div>
        <img :src="require(`~/assets/game/border_right.png`)" class="gameBoard-vert">
      </div>
      <img :src="require(`~/assets/game/border_bottom_legend.png`)" class="gameBoard-horz">
    </v-row>
    <v-row>
      <v-col align="center">
        <h3>Turn Information Goes Here</h3>
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
        ...mapGetters('sessionStorage', ['MATCH_PGN']),
        matchMoves () {
            return this.MATCH_PGN(this.topicId);
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
        getTile(row, col) {
            let piece = this.translatedGameState[row - 1][col - 1];
            return require(`~/assets/game/${piece}.png`);
        },
        getTileColor(row, col) {
            if (row % 2 == col % 2) {
                return 'g' // tile is light
            } else {
                return 'b' // tile is dark
            }
        },
        translateGameState (gameState) {
            for (let row = 0; row < gameState.length; row++) {
                for (let col = 0; col < gameState[row].length; col++) {
                    let tileColor = this.getTileColor(row, col);
                    
                    if (!!gameState[row][col]) {
                        let pieceType = gameState[row][col].type;
                        let pieceColor = gameState[row][col].color;

                        this.translatedGameState[row][col] = pieceColor + pieceType + tileColor;
                    } else {
                        this.translatedGameState[row][col] = tileColor;
                    }
                }
            }
        },
        gameHistory () {
            return this.game.history();
        },
    }
}
</script>

