<template>
<v-container fluid class="content-body game-panel">
  <v-row>
    <v-col>
      <ChessBoard
        :userType="userType"
        :displayedBoardState="displayedBoardState"
        :isLatestTurnDisplayed="isLatestTurnDisplayed" />
    </v-col>
  </v-row>
  <v-row align="center" justify="center" class="mt-0">
    <v-spacer />
    <v-col cols="3" sm="2" align="center">
      <v-btn
        @click.prevent="displayFirstMove()"
        :disabled="!prevMoves">
        <<
           </v-btn>
    </v-col>
    <v-col cols="3" sm="2" align="center">
      <v-btn
        @click.prevent="displayPrevMove()"
        :disabled="!prevMoves">
        <
          </v-btn>
    </v-col>
    <v-col cols="3" sm="2" align="center">
      <v-btn
        @click.prevent="displayNextMove()"
        :disabled="!nextMoves">
        >
      </v-btn>
    </v-col>
    <v-col cols="3" sm="2" align="center">
      <v-btn
        @click.prevent="displayLastMove()"
        :disabled="!nextMoves">
        >>
      </v-btn>
    </v-col>
    <v-spacer />
  </v-row>
  <v-row align="center" justify="center">
    <v-col cols="12" align="center">
      <h4>{{ turnStatus() }}</h4>
      <div v-show="inCheck && !isGameOver && !playerResigned">
        <span style="color: red;"><h4>Check</h4></span>
      </div>
    </v-col>
    <div v-show="userType != 'o' && userType == currentTurn && !isGameOver && !playerResigned">
      <div v-if="!SUBMITTING_MOVE">
        <v-col cols="12" align="center">
          <v-form
            @submit.prevent="submitMove"
            :disabled="!isLatestTurnDisplayed">
            <v-row align="center">
              <v-spacer />
              <v-col cols="12" sm="2">
                <strong>Move</strong>
              </v-col>
              <v-col cols="12" sm="2">
                <v-text-field
                  v-model="activeSquare"
                  :error-messages="activeSquareErrors"
                  required
                  autocomplete="off"
                  @input="$v.activeSquare.$touch()"
                  @blur="$v.activeSquare.$touch()"
                  label="Square"/>
              </v-col>
              <v-col cols="12" sm="1">
                <strong> To </strong>
              </v-col>
              <v-col cols="12" sm="3">
                <v-select
                  v-model="targetSquare"
                  :items="getLegalMoves(this.activeSquare)"
                  :error-messages="targetSquareErrors"
                  required
                  @input="$v.targetSquare.$touch()"
                  @blur="$v.targetSquare.$touch()"
                  label="Target"/>
              </v-col>
              <v-col cols="12" sm="2">
                <v-btn type="submitMove"
                       :disabled="!isLatestTurnDisplayed">Send</v-btn>
              </v-col>
              <v-spacer />
              <v-col cols="12">
                <ResignDialog
                  :topicId="topicId" />
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </div>
      <div v-else-if="SUBMITTING_MOVE" style="margin-top: 4vh;">
        <LoadingPanel loadingText="SUBMITTING"
                      warningTime=12000 />
      </div>
    </div>
  </v-row>
  
  <v-dialog
    persistent
    v-model="promoDialog"
    max-width="500">
    <v-card>
      <v-card-title>
        Pawn Promotion
      </v-card-title>
      
      <v-card-text>
        <v-btn
          block
          :disabled="promotion == 'b'"
          @click.prevent="setPromo('b')">
          Bishop
        </v-btn>
        <v-btn
          block
          :disabled="promotion == 'n'"
          @click.prevent="setPromo('n')">
          Knight
        </v-btn>
        <v-btn
          block
          :disabled="promotion == 'r'"
          @click.prevent="setPromo('r')">
          Rook
        </v-btn>
        <v-btn
          block
          :disabled="promotion == 'q'"
          @click.prevent="setPromo('q')">
          Queen
        </v-btn>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions>
        <v-btn
          color="primary"
          text
          @click="cancelMove()">
          Cancel Move
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click.prevent="confirmMove(true)">
          Confirm
        </v-btn>
      </v-card-actions>
      
    </v-card>
  </v-dialog>
</v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, helpers } from 'vuelidate/lib/validators';
import Chess from 'chess.js';

const squareRegex = helpers.regex('squareRegex', /^[a-hA-H][1-8]$/);
var legalActiveSquare = (value, vm) => { return vm.getLegalMoves(vm.activeSquare.toLowerCase()).length > 0 };
var legalTargetSquare = (value, vm) => { return vm.getLegalMoves(vm.activeSquare.toLowerCase()).includes(vm.targetSquare) };

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
            isLatestTurnDisplayed: true,
            inCheck: false,
            isGameOver: false,
            turnIndex: 0,
            prevMoves: false,
            nextMoves: false,
            displayedBoardState: {},
            promoDialog: false
        }
    },
    
    computed: {
        ...mapState(['SUBMITTING_MOVE']),
        ...mapGetters('sessionStorage', ['LATEST_MATCH_PGN',
                                         'GAME_PGN',
                                         'GAME_STATE',
                                         'GAME_TURN',
                                         'GAME_LEGAL_MOVES',
                                         'GAME_HISTORY',
                                         'GAME_CHECK_STATUS',
                                         'GAME_RESIGNED_STATUS',
                                         'GAME_OVER_STATUS']),
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
        },
        playerResigned () {
            return this.GAME_RESIGNED_STATUS(this.topicId);
        },
    },
    
    watch: {
        latestMatchPgn (newMatchPgn, oldMatchPgn) {
            // load new pgn into our vuex game state
            this.LOAD_PGN({
                topicId: this.topicId,
                newPgn: newMatchPgn
            });
            
            // display the latest game state on our dummy board
            this.turnIndex = this.GAME_HISTORY(this.topicId).length;
            this.displayTurn(this.turnIndex);
            
            // check if the game is in check or over
            this.inCheck = this.GAME_CHECK_STATUS(this.topicId);
            this.isGameOver = this.GAME_OVER_STATUS(this.topicId);
            
            // if we were submitting the move, it came back
            this.TOGGLE_SUBMITTING_MOVE(false);
        },
        turnIndex (newTurnIndex, oldTurnIndex) {
            // is this the first move?
            if (newTurnIndex == 1) {
                this.prevMoves = false;
            } else {
                this.prevMoves = true;
            }
            
            // is this the last move?
            if (newTurnIndex == this.GAME_HISTORY(this.topicId).length) {
                this.nextMoves = false
            } else {
                this.nextMoves = true;
            }
            
            this.displayTurn(newTurnIndex);
        }
    },
    
    created () {
        this.setupGameState();
    },

    mounted () {
        this.turnIndex = this.GAME_HISTORY(this.topicId).length;
    },
    
    methods: {
        ...mapMutations(['TOGGLE_SUBMITTING_MOVE']),
        ...mapMutations('sessionStorage', ['LOAD_PGN']),
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
                this.turnIndex = this.GAME_HISTORY(this.topicId).length;
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
        
        /* Chess Board and History */
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
        turnStatus () {
            let turnStatusString = '';

            // first check if a player resigned
            if (this.playerResigned) {
                this.currentTurn = '';
                turnStatusString = this.playerResigned;
                return turnStatusString;
            }
            
            // then check if the game is over
            if (this.isGameOver) {
                this.currentTurn = '';
                turnStatusString = this.isGameOver;
                return turnStatusString;
            }

            // otherwise set the string to the current player's turn
            if (this.GAME_TURN(this.topicId) == 'w') {
                this.currentTurn = 'w';
                if (this.userType == 'w') {
                    turnStatusString = 'Your Move, White';
                } else {
                    turnStatusString = 'White to Move';
                }
            } else {
                this.currentTurn = 'b';
                if (this.userType == 'b') {
                    turnStatusString = 'Your Move, Black';
                } else {
                    turnStatusString = 'Black to Move';
                }
            }

            return turnStatusString;
        },
        displayFirstMove () {
            if (this.turnIndex == 1) {
                this.displayTurn(1); // sloppy handling of init state
            } else {
                this.turnIndex = 1;
            }
        },
        displayPrevMove () {
            if (this.turnIndex > 1) {
                this.turnIndex -= 1;
            } else {
                this.displayTurn(1); // sloppy handling of init state
            }
        },
        displayNextMove () {
            if (this.turnIndex < this.GAME_HISTORY(this.topicId).length) {
                this.turnIndex += 1;
            }
        },
        displayLastMove () {
            this.turnIndex = this.GAME_HISTORY(this.topicId).length;
        },
        displayTurn (turnIndex) {
            let gameHistory = this.GAME_HISTORY(this.topicId).slice(0, turnIndex);

            if (turnIndex < this.GAME_HISTORY(this.topicId).length) {
                this.isLatestTurnDisplayed = false;
            } else {
                this.isLatestTurnDisplayed = true;
            }
            
            this.convertGameHistoryToPgn(gameHistory);
        },
        convertGameHistoryToPgn (gameHistory) {            
            this.dummyGame = new Chess();
            
            if (gameHistory.length <= 1) {
                this.dummyGame.load_pgn('');
            } else {
                gameHistory.forEach(move => {
                    this.dummyGame.move(move);
                });
            };
            
            this.translateGameState(this.dummyGame.board());
            this.dummyGame = null;
        },

        /* Moves */
        getLegalMoves (square) {
            // we want the 'to' field from the verbose array
            let verboseLegalMoves = this.GAME_LEGAL_MOVES({
                topicId: this.topicId,
                square: square.toLowerCase()
            });
            
            let legalMoves = [];
            verboseLegalMoves.forEach(square => legalMoves.push(square.to));
            return legalMoves;
        },
        createMoveMessagePayload (promo=false) {
            let newMove = {};
            
            // make the move on the dummy board and grab the new pgn
            if (promo) {
                newMove = {
                    'from': this.activeSquare.toLowerCase(),
                    'to': this.targetSquare,
                    'promotion': this.promotion
                };
            } else {
                newMove = {
                    'from': this.activeSquare.toLowerCase(),
                    'to': this.targetSquare
                };
            }
            
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
        isPromotion () {
            let newMove = {
                'from': this.activeSquare.toLowerCase(),
                'to': this.targetSquare,
            };
            
            let promoCheck = this.dummyGame.moves({ verbose: true })
                .filter((move) => move.from === newMove.from && 
                        move.to === newMove.to &&
                        move.flags.includes('p')).length > 0;
            
            return promoCheck;
        },
        setPromo (piece) {
            this.promotion = piece;
        },
        async submitMove () {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                this.TOGGLE_SUBMITTING_MOVE(true);
                
                // give dummy game the current game state
                let currentGameState = this.GAME_PGN(this.topicId);
                this.dummyGame = new Chess();
                this.dummyGame.load_pgn(currentGameState);
                
                // check for promotion and spawn promo modal if so
                if (this.isPromotion()) {
                    this.promotion = 'q'; // default to queen
                    this.promoDialog = true;
                } else {
                    this.confirmMove();
                }
            }
        },
        async confirmMove (promo=false) {
            this.promoDialog = false;
            // pass whether its a promo move to the message payload
            let messagePayload = await this.createMoveMessagePayload(promo);
            const response = await this.SEND_MESSAGE(messagePayload);
            
            if (!response.success) {
                this.TOGGLE_SUBMITTING_MOVE(false);
            }
        },
        cancelMove () {
            this.promoDialog = false;
            this.dummyGame = null;
            this.activeSquare = '';
            this.targetSquare = '';
            this.promotion = '';
            this.TOGGLE_SUBMITTING_MOVE(false);
        }
    }
}
</script>
