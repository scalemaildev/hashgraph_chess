<template>
<v-container>
  Match Components Group
</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['topicId'],
    
    data () {
        return {
            matchDataLoaded: false
        }
    },

    computed: {
        ...mapGetters('sessionStorage', ['MATCH_DATA']),
        matchData () {
            return this.MATCH_DATA(this.topicId);
        },
    },

    watch: {
        matchData (newMatchData, oldMatchData) {
            if (!newMatchData.created) {
                this.matchDataLoaded = false;
            } else {
                this.matchDataLoaded = true;
            }
        }
    },
    
    mounted() {
        this.SUBSCRIBE_TO_TOPIC(this.topicId);
    },
    
    methods: {
        ...mapActions('sessionStorage', ['SUBSCRIBE_TO_TOPIC'])
    }
}
</script>
