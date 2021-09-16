<template>
<v-container fluid class="gamePanel-wrapper">
  <v-row fluid>
    <v-col align="center" justify="center">
      <div class="board merida">
        <div ref="board" class="cg-board-wrap"></div>
      </div>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Chess from "chess.js";
import { Chessground } from "chessgroundx";

export default {
    props: {
        topicId: {
            type: String,
            required: true
        },
        fen: {
            type: String,
            default: "",
        },
        viewOnly: {
            type: Boolean,
            default: false,
        },
        drawable: {
            type: Boolean,
            default: false,
        },
        free: {
            type: Boolean,
            default: false,
        },
        showThreats: {
            type: Boolean,
            default: false,
        },
        onPromotion: {
            type: Function,
            default: () => "q",
        },
        orientation: {
            type: String,
            default: "white",
        },
    },
    
    computed: {
        ...mapGetters('sessionStorage', ['MATCH_MOVES']),
        matchMoves () {
            return this.MATCH_MOVES(this.topicId);
        },
    },
    
    watch: {
        fen: function (newFen) {
            this.fen = newFen;
            this.loadPosition();
        },
        orientation: function (orientation) {
            this.orientation = orientation;
            this.loadPosition();
        },
        showThreats: function (st) {
            this.showThreats = st;
            if (this.showThreats) {
                this.paintThreats();
            }
        },
    },
    
    mounted() {
        this.loadPosition();
        this.board.set({
            viewOnly: true,
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            turnColor: 'white',
            movable: {
                color: 'white',
            }
        });
    },
    
    created() {
        this.game = new Chess();
        this.board = null;
        this.promotions = [];
        this.promoteTo = "q";
    },
    
    methods: {
        uniques(arr) {
            let uniqueArray = arr.filter(function (elem, index, self) {
                return index === self.indexOf(elem)
            })
            return uniqueArray
        },
        possibleMoves() {
            const dests = {};
            this.game.SQUARES.forEach((s) => {
                const ms = this.game.moves({ square: s, verbose: true });
                if (ms.length) dests[s] = ms.map((m) => m.to);
            });
            return dests;
        },
        opponentMoves() {
            let originalPGN = this.game.pgn();
            let tokens = this.game.fen().split(" ");
            tokens[1] = tokens[1] === "w" ? "b" : "w";
            tokens = tokens.join(" ");
            let valid = this.game.load(tokens);
            if (valid) {
                let moves = this.game.moves({ verbose: true });
                this.game.load_pgn(originalPGN);
                return moves;
            } else {
                return [];
            }
        },
        toColor() {
            return this.game.turn() === "w" ? "white" : "black";
        },
        paintThreats() {
            let moves = this.game.moves({ verbose: true });
            let threats = [];
            moves.forEach(function (move) {
                threats.push({ orig: move.to, brush: "yellow" });
                
                if (move["captured"]) {
                    threats.push({ orig: move.from, dest: move.to, brush: "red" });
                }
                if (move["san"].includes("+")) {
                    threats.push({ orig: move.from, dest: move.to, brush: "blue" });
                }
            });
            this.board.setShapes(threats);
        },
        calculatePromotions() {
            let moves = this.game.moves({ verbose: true });
            this.promotions = [];
            for (let move of moves) {
                if (move.promotion) {
                    this.promotions.push(move);
                }
            }
        },
        isPromotion(orig, dest) {
            let filteredPromotions = this.promotions.filter(
                (move) => move.from === orig && move.to === dest
            );
            return filteredPromotions.length > 0; // The current movement is a promotion
        },
        changeTurn() {
            return (orig, dest, metadata) => {
                if (this.isPromotion(orig, dest)) {
                    this.promoteTo = this.onPromotion();
                }
                this.game.move({ from: orig, to: dest, promotion: this.promoteTo }); // promote to queen for simplicity
                this.board.set({
                    fen: this.game.fen(),
                    turnColor: this.toColor(),
                    movable: {
                        color: this.toColor(),
                        dests: this.possibleMoves(),
                    },
                    drawable: {
                        enabled: this.drawable,
                    },
                });
                this.calculatePromotions();
                this.afterMove();
            };
        },
        afterMove() {
            if (this.showThreats) {
                this.paintThreats();
            }
            let threats = this.countThreats(this.toColor()) || {};
            threats["history"] = this.game.history();
            threats["fen"] = this.game.fen();
            this.$emit("onMove", threats);
        },
        countThreats(color) {
            let threats = {};
            let captures = 0;
            let checks = 0;
            let moves = this.game.moves({ verbose: true });
            if (color !== this.toColor()) {
                moves = this.opponentMoves();
            }
            
            if (moves.length === 0) {
                return null; // It´s an invalid position
            }
            
            moves.forEach(function (move) {
                if (move["captured"]) {
                    captures++;
                }
                if (move["san"].includes("+")) {
                    checks++;
                }
            });
            
            threats[`legal_${color}`] = this.uniques(
                moves.map((x) => x.from + x.to)
            ).length; // promotions count as 4 moves. This remove those duplicates moves.
            threats[`checks_${color}`] = checks;
            threats[`threat_${color}`] = captures;
            threats[`turn`] = color;
            return threats;
        },
        loadPosition() {
            // set a default value for the configuration object itself to allow call to loadPosition()
            this.game.load(this.fen);
            this.board = Chessground(this.$refs.board, {
                viewOnly: this.viewOnly,
                fen: this.game.fen(),
                turnColor: this.toColor(),
                movable: {
                    free: this.free,
                    dests: this.possibleMoves(),
                },
                drawable: {
                    enabled: this.drawable,
                },
                selectable: {
                    // disable to enforce dragging over click-click move
                    enabled: false,
                },
                orientation: this.orientation,
                premovable: {
                    enabled: true,
                    showDests: true,
                    castle: true,
                },
            });
            this.board.set({
                movable: { events: { after: this.changeTurn() } },
            });
            this.afterMove();
        },
        lockBoard(fen) {
            this.chess.load(fen)
            
            this.board.set({
                viewOnly: true,
                fen: fen,
                turnColor: 'white',
                movable: {
                    color: 'white',
                }
            })
        },
    },
}
</script>
