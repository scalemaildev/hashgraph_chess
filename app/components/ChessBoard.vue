<template>
  <v-container fluid>
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
  </v-container>
</template>

<script>
export default {
    props: ['userType', 'displayedBoardState', 'turnIndex'],
    
    computed: {
        pieceStyle() {
            let edge = this.getTileEdge();
            
            return { width: edge, height: edge };
        },
        horzFrameSize() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return { width: '300px', height: '10px' }
            case 'sm': return { width: '384px', height: '14px' }
            case 'md': return { width: '340px', height: '10px' }
            case 'lg': return { width: '384px', height: '14px' }
            case 'xl': return { width: '510px', height: '16px' }
            }
        },
        vertFrameSize() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return { width: '10px', height: '280px' }
            case 'sm': return { width: '12px', height: '360px' }
            case 'md': return { width: '10px', height: '320px' }
            case 'lg': return { width: '12px', height: '360px' }
            case 'xl': return { width: '15px', height: '480px' }
            }
        },
    },
    
    methods: {
        getTile(row, col) {
            let piece = this.displayedBoardState[row - 1][col - 1];
            return `/game/${piece}.png`;
        },
        getTileBg(row, col) {
            let bg = (col + row) % 2 === 0 ? "url('/game/b.png')" : "url('/game/g.png')";
            let edge = this.getTileEdge();
            
            return { width: edge, height: edge, background: bg };
        },
        getTileEdge() {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return '35px'
            case 'sm': return '45px'
            case 'md': return '40px'
            case 'lg': return '45px'
            case 'xl': return '60px'
            }
        },
    }
}
</script>
