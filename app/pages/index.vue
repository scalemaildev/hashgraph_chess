<template>
<div>
  <div v-show="ACTIVE_PANEL == 'loadingPanel'" class="content-spaced-mid">
    <LoadingPanel />
  </div>
  <div v-show="ACTIVE_PANEL == 'startPanel'">
    <StartPanel />
  </div>
  <div v-show="ACTIVE_PANEL == 'clientPanel'">
    <AccountPanel />
  </div>
  <div v-show="ACTIVE_PANEL == 'newMatchPanel'">
    <NewMatchPanel />
  </div>
  <div v-show="ACTIVE_PANEL == 'joinMatchPanel'">
    <JoinMatchPanel />
  </div>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
    computed: {
        ...mapState('sessionStorage', ['CLIENT_EXISTS', 'ACTIVE_PANEL']),
    },
    
    created() {
        this.SET_ACTIVE_PANEL('loadingPanel');
    },
    
    mounted() {
        this.startup();
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL',
                                           'TOGGLE_LOCK_BUTTON']),
        startup() {
            if (!this.CLIENT_EXISTS) {
                this.SET_ACTIVE_PANEL('startPanel');
            } else {
                this.SET_ACTIVE_PANEL('clientPanel');
                this.TOGGLE_LOCK_BUTTON(true);
            }
        },
    },
};
</script>
