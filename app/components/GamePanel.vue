<template>
  <v-container fluid class="gamePanel-wrapper">
    <v-row no-gutters align="center" class="flex-column d-flex">
      <nuxt-img src="/game/border_top.png" :style="horzFrameSize"/>
      <div class="d-flex" style="position: relative">
          <nuxt-img src="/game/border_left_legend.png"
                    :style="vertFrameSize"/>
        <div v-for="col in 8" :key="col">
          <div v-for="row in 8" :key="row">
            <div :style="getTileBg(row, col)">
              <nuxt-img :src="getTile(row, col)"
                        :style="pieceStyle"/>
            </div>
          </div>  
        </div>
        <img src="/game/border_right.png"
           :style="vertFrameSize">
      </div>
      <img src="/game/border_bottom_legend.png"
           :style="horzFrameSize">
    </v-row>
    <v-row>
      <v-col cols="12" align="center">
        <h4>Turn Info and Scroll Buttons Here</h4>
      </v-col>
      <v-col cols="12" align="center">
        <strong>It Is Your Move</strong>
        <v-form
          @submit.prevent="submitMove">
          <v-row align="center">
            <v-spacer />
            <v-col cols="2">
              <strong>Move</strong>
            </v-col>
              <v-col cols="2">
                <v-text-field
                v-model="activeSquare"
                :error-messages="activeSquareErrors"
                required
                @input="$v.activeSquare.$touch()"
                @blur="$v.activeSquare.$touch()"
                label="Square"/>
              </v-col>
              <v-col cols="1">
                <strong> To </strong>
              </v-col>
              <v-col cols="2">
                <v-text-field
                v-model="targetSquare"
                :error-messages="targetSquareErrors"
                required
                @input="$v.targetSquare.$touch()"
                @blur="$v.targetSquare.$touch()"
                label="Target"/>
              </v-col>
              <v-col cols="2">
                <v-btn type="submitMove">Send</v-btn>
              </v-col>
            <v-spacer />
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, helpers } from 'vuelidate/lib/validators';
import Chess from 'chess.js';

const squareRegex = helpers.regex('squareRegex', /^[a-hA-H][1-8]$/);
var legalActiveSquare = (value, vm) => { return vm.getLegalMoves(vm.activeSquare).length > 0 };
var legalTargetSquare = (value, vm) => { return vm.getLegalMoves(vm.activeSquare).includes(vm.targetSquare) };

export default {
    props: ['topicId'],
    
    mixins: [validationMixin],
    
    validations: {
        activeSquare: { required, squareRegex, legalActiveSquare },
        targetSquare: { required, squareRegex, legalTargetSquare },
    },
    
    data () {
        return {
            game: null,
            pgn: '',
            submittingMove: false,
            submitError: false,
            activeSquare: '',
            targetSquare: '',
            playerWhite: '',
            playerBlack: '',
            translatedGameState: {}
        }
    },
    
    computed: {
        ...mapGetters('sessionStorage', ['MATCH_DATA', 'MATCH_MOVES']),
        matchMoves () {
            return this.MATCH_MOVES(this.topicId);
        },
        activeSquareErrors () {
            const errors = [];
            if (!this.$v.activeSquare.$dirty) return errors
            !this.$v.activeSquare.required && errors.push('Required');
            !this.$v.activeSquare.squareRegex && errors.push('Should look like e4 or E4')
            !this.$v.activeSquare.legalActiveSquare && errors.push('No legal moves for this square')
            return errors;
        },
        targetSquareErrors () {
            const errors = [];
            if (!this.$v.targetSquare.$dirty) return errors
            !this.$v.targetSquare.required && errors.push('Required');
            !this.$v.targetSquare.squareRegex && errors.push('Should look like e4 or E4')
            !this.$v.targetSquare.legalTargetSquare && errors.push('Illegal move')
            return errors;
        },
        gameState () {
            if (!!this.game) {
                return this.game.board();
            }
        },
        gameTurn () {
            if (!!this.game) {
                return this.game.turn();
            }
        },
        pieceStyle() {
            let edge = this.getTileEdge();
            
            return { width: edge, height: edge };
        },
        horzFrameSize() { // TODO: fix heights for scale
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return { width: '180px', height: '10px' }
            case 'sm': return { width: '260px', height: '10px' }
            case 'md': return { width: '340px', height: '10px' }
            case 'lg': return { width: '380px', height: '10px' }
            case 'xl': return { width: '60px', height: '10px' } // TODO
            }
        },
        vertFrameSize() { // TODO: fix widths for scale
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
        matchMoves (newMatchMoves, oldMatchMoves) {
            // finds all the elements of arr2 that are not in arr1
            //let newMoves = newMatchMoves.filter( 
                //val => !oldMatchMoves.find( move => move.from === val)
            //); // outputs "newValue"

            console.log(newMatchMoves);
        }
    },
    
    created () {
        this.setupTranslatedGameState();
        this.assignPlayerColors();
        this.game = new Chess();
        this.translateGameState(this.game.board());
    },
    
    mounted () {
    },
    
    methods: {
        ...mapActions('sessionStorage', ['SEND_MESSAGE']),
        getTile(row, col) {
            let piece = this.translatedGameState[row - 1][col - 1];
            return `/game/${piece}.png`;
        },
        getTileBg(row, col) {
            let bg = (col + row) % 2 === 0 ? "url('/game/b.png')" : "url('/game/g.png')";
            let edge = this.getTileEdge();
            
            return { width: edge, height: edge, background: bg };
        },
        getTileEdge() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return '20px'
            case 'sm': return '30px'
            case 'md': return '40px'
            case 'lg': return '45px'
            case 'xl': return '60px' // TODO
            }
        },
        assignPlayerColors() {
            this.playerWhite = this.MATCH_DATA(this.topicId).playerWhite;
            this.playerBlack = this.MATCH_DATA(this.topicId).playerBlack;
        },
        setupTranslatedGameState () {
            for (let i = 0; i <= 7; i++)
            this.translatedGameState[i] = Array(8);
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
        getLegalMoves (square) {
            return this.game.moves({ square: square });
        },
        async submitMove () {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                this.submittingMove = true;
                
                let messagePayload = {
	            messageType: 'chessMove',
                    topicId: this.topicId,
                    activeSquare: this.activeSquare,
                    targetSquare: this.targetSquare
                };
                
                const response = await this.SEND_MESSAGE(messagePayload);

                if (response.result == 'SUCCESS') {
                    this.activeSquare = '';
                    this.targetSquare = '';
                    this.submittingMove = false;
                } else {
                    this.submittingMove = false;
                    this.submitError = true;
                }
            }
        }
    }
}
</script>

