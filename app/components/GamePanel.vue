<template>
  <v-container fluid class="gamePanel-wrapper">
    <v-row no-gutters align="center" class="flex-column d-flex">
      <nuxt-img src="/game/border_top.png" :style="horzSize"/>
      <div class="d-flex" style="position: relative">
          <nuxt-img src="/game/border_left_legend.png"
                    :style="vertSize"/>
        <div v-for="col in 8" :key="col">
          <div v-for="row in 8" :key="row">
            <div :style="tileSize">
              <nuxt-img :src="getTile(row,col)"
                        :style="tileSize"/>
            </div>
          </div>  
        </div>
        <img src="/game/border_right.png"
           :style="vertSize">
      </div>
      <img src="/game/border_bottom_legend.png"
           :style="horzSize">
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" align="center">
        <h4>Turn Info and Scroll Buttons Here</h4>
      </v-col>
      <v-col cols="12" align="center">
        <h3>Move Input Here (hide if scrolling)</h3>
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
                0: Array(8), //row 8
                1: Array(8),
                2: Array(8),
                3: Array(8),
                4: Array(8),
                5: Array(8),
                6: Array(8),
                7: Array(8) // row 1
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
        gameTurn () {
            if (!!this.game) {
                let turn = this.game.turn();
                if (turn == 'w') {
                    return 'White to Move'
                } else if (turn == 'b') {
                    return 'Black to Move'
                } else {
                    return 'Game Over'
                }
            }
        },
        tileSize(row, col) {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return { width: '20px', height: '20px' }
            case 'sm': return { width: '30px', height: '30px' }
            case 'md': return { width: '40px', height: '40px' }
            case 'lg': return { width: '45px', height: '45px' }
            case 'xl': return { width: '60px', height: '60px' } // TODO
            }
        },
        horzSize() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return { width: '180px', height: '10px' }
            case 'sm': return { width: '260px', height: '10px' }
            case 'md': return { width: '340px', height: '10px' }
            case 'lg': return { width: '380px', height: '10px' }
            case 'xl': return { width: '60px', height: '10px' } // TODO
            }
        },
        vertSize() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return { width: '10px', height: '160px' }
            case 'sm': return { width: '10px', height: '240px' }
            case 'md': return { width: '10px', height: '320px' }
            case 'lg': return { width: '10px', height: '360px' }
            case 'xl': return { width: '10px', height: '60px' } // TODO
            }
        }
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
            return `/game/${piece}.png`;
        },
        translateGameState (gameState) {
            for (let row = 0; row < gameState.length; row++) {
                for (let col = 0; col < gameState[row].length; col++) {
                    if (!!gameState[row][col]) {
                        let pieceType = gameState[row][col].type;
                        let pieceColor = gameState[row][col].color;

                        this.translatedGameState[row][col] = pieceColor + pieceType;
                    } else {
                        this.translatedGameState[row][col] = 'blank';
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

