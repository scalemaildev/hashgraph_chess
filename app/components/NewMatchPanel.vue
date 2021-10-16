<template>
<v-container class="content-body">
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <h1>Create A New Match</h1>
    </v-col>
    <v-col cols="12" align="center" justify="center">
      <p>From this panel, you can create a new chess match. You'll need to know your opponent's <strong>Account ID</strong> in order to create the match. Other players can join your match as observers, but only you and your opponent will be able to move pieces or send chat messages.</p>
      <p>After creating the match, you'll be given a <strong>Topic ID</strong>. To invite your opponent to the match, give them this ID. They can enter it on the <strong>Join Game</strong> panel to enter the match.</p>
    </v-col>    
  </v-row>
  <!-- MATCH CREATION FORM -->
  <div v-if="!creatingMatch">
    <v-form
      @submit.prevent="submit">
      <v-row
        no-gutters
        style="flex-wrap: nowrap;"
        class="pb-2">
        <v-col class="flex-grow-1 flex-shrink-0">
          <v-text-field
            v-model="opponentAccountId"
            :error-messages="opponentAccountIdErrors"
            required
            @input="$v.opponentAccountId.$touch()"
            @blur="$v.opponentAccountId.$touch()"
            label="Opponent's ID"/>
        </v-col>
        <v-col class="flex-grow-0 flex-shrink-1 pa-2">
          <v-btn type="submit">
            Create Match
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col cols="12" align="center" justify="center">
        <v-btn block @click="returnToAccountPanel">
          Return
        </v-btn>
      </v-col>
    </v-row>    
  </div>
  <div v-if="matchCreationError" class="spaced-small">
    <v-row align="center" justify="center">
      <v-col cols="12" align="center" justify="center">
        <span style="color: red;"><h3>An error occurred creating the match:</h3></span>
        <p style="color: red;">Check the console log for potential details.</p>
      </v-col>
    </v-row>
  </div>
  <!-- LOADING -->
  <div v-if="creatingMatch" class="spaced-small">
    <LoadingPanel loadingText="CREATING MATCH"
                  warningTime=12000 />
  </div>
</div>
</v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, helpers } from 'vuelidate/lib/validators';

const accountIdRegex = helpers.regex('accountIdRegex', /0.0.[0-9]{3,}/);
const notSameAccount = (value, vm) => { return vm.ACCOUNT_ID != vm.opponentAccountId }

export default {
    mixins: [validationMixin],
    
    validations: {
        opponentAccountId: { required, accountIdRegex, notSameAccount },
    },
    
    data () {
        return {
            opponentAccountId: "",
            matchCreationError: false,
            creatingMatch: false
        }
    },
    
    computed: {
        ...mapState('sessionStorage', ['ACCOUNT_ID',
                                      'MATCHES']),
        opponentAccountIdErrors () {
            const errors = [];
            if (!this.$v.opponentAccountId.$dirty) return errors
            !this.$v.opponentAccountId.required && errors.push("An Opponent's Account ID is required.")
            !this.$v.opponentAccountId.accountIdRegex && errors.push('Account ID should look like 0.0.xxx.')
            !this.$v.opponentAccountId.notSameAccount && errors.push("You can't play with yourself")
            return errors;
        },
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL']),
        ...mapActions('sessionStorage', ['CREATE_MATCH']),
        returnToAccountPanel () {
            this.opponentAccountId = "";
            this.SET_ACTIVE_PANEL('clientPanel');
        },
        submit () {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                this.createMatch();
            }
        },
        async createMatch() {
            this.matchCreationError = false;
            this.creatingMatch = true;
            
            const response = await this.CREATE_MATCH({
                'playerWhite': this.ACCOUNT_ID,
                'playerBlack': this.opponentAccountId
            });

            if (response.success) {
                this.opponentAccountId = "";
                let topicId = response.newTopicId;
                console.log(response.responseMessage);
                let newMatchUrl = "/matches/" + topicId;
                this.$router.push(newMatchUrl);
            } else {
                console.error(response.errorMessage);
                this.matchCreationError = true;
                this.creatingMatch = false;
            }
        }
    },
}
</script>
