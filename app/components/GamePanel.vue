<template>
<v-container class="gamePanel-wrapper">
  <v-row>
    <v-col>
      <v-row no-gutters>
        <div v-for="tile in Array(8).keys()" :key="tile.key" class="tile-wrapper">
          <img :src="getBaseTile(tile,0)" class="tileImage">
        </div>
      </v-row>
      <v-row no-gutters>
        <div v-for="tile in Array(8).keys()" :key="tile.key" class="tile-wrapper">
          <img :src="getBaseTile(tile,1)" class="tileImage">
        </div>
      </v-row>
      <v-row no-gutters>
        <div v-for="tile in Array(8).keys()" :key="tile.key" class="tile-wrapper">
          <img :src="getBaseTile(tile,2)" class="tileImage">
        </div>
      </v-row>
      <v-row no-gutters>
        <div v-for="tile in Array(8).keys()" :key="tile.key" class="tile-wrapper">
          <img :src="getBaseTile(tile,3)" class="tileImage">
        </div>
      </v-row>
      <v-row no-gutters>
        <div v-for="tile in Array(8).keys()" :key="tile.key" class="tile-wrapper">
          <img :src="getBaseTile(tile,4)" class="tileImage">
        </div>
      </v-row>
      <v-row no-gutters>
        <div v-for="tile in Array(8).keys()" :key="tile.key" class="tile-wrapper">
          <img :src="getBaseTile(tile,5)" class="tileImage">
        </div>
      </v-row>
      <v-row no-gutters>
        <div v-for="tile in Array(8).keys()" :key="tile.key" class="tile-wrapper">
          <img :src="getBaseTile(tile,6)" class="tileImage">
        </div>
      </v-row>
      <v-row no-gutters>
        <div v-for="tile in Array(8).keys()" :key="tile.key" class="tile-wrapper">
          <img :src="getBaseTile(tile,7)" class="tileImage">
        </div>
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
        //this.translateGameState(this.game.board());
    },
    
    mounted () {
    },
    
    methods: {
        getBaseTile(col, row) {
            let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            return require(`~/assets/board/${letters[col]}${row + 1}.png`);
        },
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
                        this.translatedGameState[row][col] = this.getBaseTile(row, col);
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

