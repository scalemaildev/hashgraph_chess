<template>
<v-container class="content-body">
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <h1>Create A New Match</h1>
    </v-col>
    <v-col cols="12" align="center" justify="center">
      <p>From this panel, you can create a new chess match. You'll need to know your opponent's <strong>Account ID</strong> in order to create the match. Other players will also be able to join your match as observers, but only you and your opponent will be able to move pieces and send chat messages.</p>
      <p>After creating the match, you'll be given a <strong>Topic ID</strong>. To invite your opponent to the match, give them this ID. They can input it on the <strong>Join Game</strong> panel to enter the match.</p>
    </v-col>    
  </v-row>
  <v-form>
    <v-row
      no-gutters
      style="flex-wrap: nowrap;">
      <v-col class="flex-grow-1 flex-shrink-0">
	<v-text-field
	  v-model="oppAccountId"
	  :error-messages="oppAccountIdErrors"
	  required
	  @input="$v.oppAccountId.$touch()"
	  @blur="$v.oppAccountId.$touch()"
	  label="Opponent's Account ID"/>
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
</v-container>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate'
import { required, helpers } from 'vuelidate/lib/validators'

const accountIdRegex = helpers.regex('accountIdRegex', /0.0.[0-9]{3,}/);

export default {
    mixins: [validationMixin],
    
    validations: {
	oppAccountId: { required, accountIdRegex },
    },
    
    data () {
	return {
	    oppAccountId: "",
	}
    },
    
    computed: {
	oppAccountIdErrors () {
	    const errors = [];
	    if (!this.$v.oppAccountId.$dirty) return errors
	    !this.$v.oppAccountId.required && errors.push("An Opponent's Account ID is required.")
	    !this.$v.oppAccountId.accountIdRegex && errors.push('Account ID should look like 0.0.xxx.')
	    return errors;
	},
    },
    
    methods: {
	...mapMutations([
	    'setActivePanel',
	]),
	async createMatch () {
	    console.log('hi');
	},
	returnToAccountPanel () {
	    this.setActivePanel('accountPanel');
	}
    },
}
</script>
