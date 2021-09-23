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
                  autocomplete="off"
                  @input="$v.activeSquare.$touch()"
                  @blur="$v.activeSquare.$touch()"
                  label="Square"/>
              </v-col>
              <v-col cols="1">
                <strong> To </strong>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="targetSquare"
                  :items="getLegalMoves(this.activeSquare)"
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
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, helpers } from 'vuelidate/lib/validators';
import Chess from 'chess.js';

const squareRegex = helpers.regex('squareRegex', /^[a-h][1-8]$/);
var legalActiveSquare = (value, vm) => { return vm.getLegalMoves(vm.activeSquare).length > 0 };
var legalTargetSquare = (value, vm) => { return vm.getLegalMoves(vm.activeSquare).includes(vm.targetSquare) };

export default {
    props: ['topicId'],
    
    mixins: [validationMixin],
    
    validations: {
        activeSquare: { required, squareRegex, legalActiveSquare },
        targetSquare: { required, legalTargetSquare },
    },
    
    data () {
        return {
            game: new Chess(),
            gamePgn: '',
            dummyGame: null,
            submittingMove: false,
            submitError: false,
            activeSquare: '',
            targetSquare: '',
            promotion: '',
            playerWhite: '',
            playerBlack: '',
            currentTurn: ''
        }
    },
    
    computed: {
        ...mapGetters('sessionStorage', ['MATCH_DATA',
                                         'MATCH_PGN_LATEST',
                                         'MATCH_BOARD_STATE']),
        /* Vuelidate Errors */
        activeSquareErrors () {
            const errors = [];
            if (!this.$v.activeSquare.$dirty) return errors
            !this.$v.activeSquare.required && errors.push('Required');
            !this.$v.activeSquare.squareRegex && errors.push('Should look like e4, h1, etc')
            !this.$v.activeSquare.legalActiveSquare && errors.push('No legal moves for this square')
            return errors;
        },
        targetSquareErrors () {
            const errors = [];
            if (!this.$v.targetSquare.$dirty) return errors
            !this.$v.targetSquare.required && errors.push('Required');
            !this.$v.targetSquare.legalTargetSquare && errors.push('Illegal move')
            return errors;
        },
        
        /* CSS Styling */
        pieceStyle() {
            let edge = this.getTileEdge();
            
            return { width: edge, height: edge };
        },
        horzFrameSize() { // TODO: fix heights for scale
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return { width: '340px', height: '10px' }
            case 'sm': return { width: '384px', height: '14px' }
            case 'md': return { width: '340px', height: '10px' }
            case 'lg': return { width: '384px', height: '14px' }
            case 'xl': return { width: '510px', height: '16px' }
            }
        },
        vertFrameSize() { // TODO: fix widths for scale
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return { width: '10px', height: '320px' }
            case 'sm': return { width: '12px', height: '360px' }
            case 'md': return { width: '10px', height: '320px' }
            case 'lg': return { width: '12px', height: '360px' }
            case 'xl': return { width: '15px', height: '480px' }
            }
        },
        
        /* Data */
        matchPgn () {
            return this.MATCH_PGN_LATEST(this.topicId);
        }
    },
    
    watch: {
        matchPgn (newMatchPgn, oldMatchPgn) {
            this.gamePgn = newMatchPgn;
        },
        gamePgn (newGamePgn, oldGamePgn) {
            this.game.load_pgn(this.gamePgn);
            this.translateGameState(this.game.board());
        }
    },
    
    created () {
        this.setupGameState();
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['SET_BOARD_STATE']),
        ...mapActions('sessionStorage', ['SEND_MESSAGE']),
        
        /* Styles */
        getTile(row, col) {
            let piece = this.MATCH_BOARD_STATE(this.topicId)[row - 1][col - 1];
            return `/game/${piece}.png`;
        },
        getTileBg(row, col) {
            let bg = (col + row) % 2 === 0 ? "url('/game/b.png')" : "url('/game/g.png')";
            let edge = this.getTileEdge();
            
            return { width: edge, height: edge, background: bg };
        },
        getTileEdge() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return '40px'
            case 'sm': return '45px'
            case 'md': return '40px'
            case 'lg': return '45px'
            case 'xl': return '60px'
            }
        },
        
        /* Setup */
        assignPlayerColors() {
            this.playerWhite = this.MATCH_DATA(this.topicId).playerWhite;
            this.playerBlack = this.MATCH_DATA(this.topicId).playerBlack;
        },
        initTranslatedGameState() {
            let newBoardState = {}
            
            for (let i = 0; i <= 7; i++) {
                newBoardState[i] = Array(8).fill('blank');
            }
            
            let newBoardStateData = {
                newBoardState: newBoardState,
                topicId: this.topicId
            }
            
            this.SET_BOARD_STATE(newBoardStateData);
        },
        matchDataFound () {
            return this.MATCH_PGN_LATEST(this.topicId);
        },
        setupGameState () {
            this.assignPlayerColors();
            
            // set the board to a bunch of empty tiles
            this.initTranslatedGameState();
            
            // load current pgn if it exists in session storage
            if (this.matchDataFound()) {
                this.gamePgn = this.MATCH_PGN_LATEST(this.topicId);
                this.game.load_pgn(this.gamePgn);
            }
            
            // translate pgn into the visible game board
            this.translateGameState(this.game.board());
        },
        
        /* Board and Movement */
        translateGameState (gameState) {
            // need the object of arrays to be filled
            let newBoardState = {};
            for (let i = 0; i <= 7; i++) {
                newBoardState[i] = Array(8);
            }
            
            // go through the board and translate it to the piece images
            for (let row = 0; row < gameState.length; row++) {
                for (let col = 0; col < gameState[row].length; col++) {
                    if (!!gameState[row][col]) {
                        let pieceType = gameState[row][col].type;
                        let pieceColor = gameState[row][col].color;
                        
                        newBoardState[row][col] = pieceColor + pieceType;
                    } else {
                        newBoardState[row][col] = 'blank';
                    }
                }
            }
            
            let newBoardStateData = {
                newBoardState: newBoardState,
                topicId: this.topicId
            }
            
            this.SET_BOARD_STATE(newBoardStateData); // send it all to session storage
        },
        getLegalMoves (square) {
            // want the 'to' field from verbose array
            let verboseLegalMoves = this.game.moves({ square: square, verbose: true });
            let legalMoves = [];
            verboseLegalMoves.forEach(square => legalMoves.push(square.to));
            
            return legalMoves;
        },
        createMessagePayload () {
            // give dummy game the current game state
            let currentGameState = this.game.pgn();
            this.dummyGame = new Chess();
            this.dummyGame.load_pgn(currentGameState);
            
            // make the move on the dummy board and grab the pgn
            // TODO: add promotion handling
            // TODO: another check for move validity here? error handling?
            let newMove = {
                'from': this.activeSquare,
                'to': this.targetSquare
            };
            this.dummyGame.move(newMove);
            let newPgn = this.dummyGame.pgn();
            
            let messagePayload = {
	        messageType: 'chessMove',
                topicId: this.topicId,
                newPgn: newPgn
            };
            
            // reset the dummy board/inputs and return the payload
            this.dummyGame = null;
            this.activeSquare = '';
            this.targetSquare = '';
            this.promotion = '';

            return messagePayload;
        },
        async submitMove () {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                this.submittingMove = true;

                let messagePayload = await this.createMessagePayload();
                const response = await this.SEND_MESSAGE(messagePayload);
                
                if (response.success) {
                    this.submittingMove = false;
                } else {
                    this.submittingMove = false;
                    this.submitError = true; //TODO submit error handling
                }
            }
        }
    }
}
</script>

