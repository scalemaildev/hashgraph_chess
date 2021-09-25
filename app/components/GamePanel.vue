<template>
<v-container fluid class="gamePanel-wrapper">
  
  <ChessBoard
    :userType="userType"
    :displayedBoardState="displayedBoardState" />
  
  <v-row align="center" justify="center">
    <v-spacer />
    <v-col cols="2" align="center">
      <v-btn>
        <<
      </v-btn>
    </v-col>
    <v-col cols="2" align="center">
      <v-btn>
        <
      </v-btn>
    </v-col>
    <v-col cols="2" align="center">
      <v-btn>
        >
      </v-btn>
    </v-col>
    <v-col cols="2" align="center">
      <v-btn>
        >>
      </v-btn>
    </v-col>
    <v-spacer />
  </v-row>
  <v-row align="center" justify="center">
    <v-col cols="12" align="center">
      <h4>{{ turnStatus() }}</h4>
    </v-col>
    <div v-show="userType != 'o' && userType == currentTurn">
      <div v-if="!SUBMITTING_MOVE">
        <v-col cols="12" align="center">
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
      </div>
      <div v-else-if="SUBMITTING_MOVE" style="margin-top: 4vh;">
        <v-row>
          <v-col cols="12" align="center">
            <v-progress-circular indeterminate />
          </v-col>
          <v-col cols="12" align="center">
            <h4>... SUBMITTING ...</h4>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-row>
</v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, helpers } from 'vuelidate/lib/validators';
import Chess from 'chess.js';

const squareRegex = helpers.regex('squareRegex', /^[a-h][1-8]$/);
var legalActiveSquare = (value, vm) => { return vm.getLegalMoves(vm.activeSquare).length > 0 };
var legalTargetSquare = (value, vm) => { return vm.getLegalMoves(vm.activeSquare).includes(vm.targetSquare) };

export default {
    props: ['topicId', 'userType'],
    
    mixins: [validationMixin],
    
    validations: {
        activeSquare: { required, squareRegex, legalActiveSquare },
        targetSquare: { required, legalTargetSquare },
    },
    
    data () {
        return {
            dummyGame: null,
            activeSquare: '',
            targetSquare: '',
            promotion: '',
            currentTurn: '',
            displayedBoardState: {}
        }
    },
    
    computed: {
        ...mapState(['SUBMITTING_MOVE',
                     'MOVE_SUBMISSION_ERROR']),
        ...mapGetters('sessionStorage', ['LATEST_MATCH_PGN',
                                         'MATCH_PGNS',
                                         'GAME_PGN',
                                         'GAME_STATE',
                                         'GAME_TURN',
                                         'GAME_LEGAL_MOVES',
                                         'GAME_HISTORY']),
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
        
        /* Data */
        latestMatchPgn () {
            return this.LATEST_MATCH_PGN(this.topicId);
        }
    },
    
    watch: {
        latestMatchPgn (newMatchPgn, oldMatchPgn) {
            this.LOAD_PGN({
                topicId: this.topicId,
                newPgn: newMatchPgn
            });
            this.translateGameState(this.GAME_STATE(this.topicId));
            this.TOGGLE_SUBMITTING_MOVE(false);
        }
    },
    
    created () {
        this.setupGameState();
    },
    
    methods: {
        ...mapMutations(['TOGGLE_SUBMITTING_MOVE',
                         'TOGGLE_MOVE_SUBMISSION_ERROR']),
        ...mapMutations('sessionStorage', ['CREATE_GAME',
                                           'LOAD_PGN']),
        ...mapActions('sessionStorage', ['SEND_MESSAGE']),
        
        /* Setup */
        initTranslatedGameState() {
            let blankBoard = {};
            
            for (let i = 0; i <= 7; i++) {
                blankBoard[i] = Array(8).fill('blank');
            }

            this.displayedBoardState = blankBoard;
        },
        matchDataFound () {
            return this.LATEST_MATCH_PGN(this.topicId);
        },
        setupGameState () {
            // set the board to a bunch of empty tiles
            this.initTranslatedGameState();
            
            // load current pgn if it exists
            if (this.matchDataFound()) {
                let latestPgn = this.LATEST_MATCH_PGN(this.topicId);
                this.LOAD_PGN({
                    topicId: this.topicId,
                    newPgn: latestPgn
                });
            } else {
                this.LOAD_PGN({
                    topicId: this.topicId,
                    newPgn: ''
                });
            }

            // translate pgn into the visible game board
            this.translateGameState(this.GAME_STATE(this.topicId));
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

            // display the new board state
            this.displayedBoardState = newBoardState;
        },
        getLegalMoves (square) {
            // we want the 'to' field from the verbose array
            let verboseLegalMoves = this.GAME_LEGAL_MOVES({
                topicId: this.topicId,
                square: square
            });
            
            let legalMoves = [];
            verboseLegalMoves.forEach(square => legalMoves.push(square.to));
            return legalMoves;
        },
        createMessagePayload () {
            // give dummy game the current game state
            let currentGameState = this.GAME_PGN(this.topicId);
            this.dummyGame = new Chess();
            this.dummyGame.load_pgn(currentGameState);
            
            // make the move on the dummy board and grab the new pgn
            let newMove = {
                'from': this.activeSquare,
                'to': this.targetSquare
            };
            
            // TODO: add another move validation here? error handling?
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
                this.TOGGLE_SUBMITTING_MOVE(true);
                
                let messagePayload = await this.createMessagePayload();
                const response = await this.SEND_MESSAGE(messagePayload);
                
                if (!response.success) {
                    this.TOGGLE_SUBMITTING_MOVE(false);
                    this.TOGGLE_MOVE_SUBMISSION_ERROR(true);
                }
            }
        },
        turnStatus () {
            if (this.GAME_TURN(this.topicId) == 'w') {
                this.currentTurn = 'w';
                return 'White to Move';
            } else {
                this.currentTurn = 'b';
                return 'Black to Move';
            }
        },
        displayedPgn () {
            let gameHistory = this.GAME_HISTORY(this.topicId);
            return gameHistory.at(-1);
        }
    }
}
</script>

