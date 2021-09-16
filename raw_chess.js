export default {
  methods: {
    
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
      })

  },
  created() {
    this.game = new Chess();
    this.board = null;
    this.promotions = [];
    this.promoteTo = "q";
  },
};
