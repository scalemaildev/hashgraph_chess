<template>
<v-container class="content-body">
  <v-row>
    <v-col cols="12" align="center" justify="center">
      <h1>Join A Match</h1>
    </v-col>
    <v-col cols="12" align="center" justify="center">
      <p>From this panel, you can join a chess match. You'll need to know the match's <strong>Topic ID.</strong></p>
      <p>You can still join a match if you aren't one of its players, but doing so will restrict you to observer mode.</p>
    </v-col>    
  </v-row>
  <div>
    <v-form
      @submit.prevent="submit">
      <v-row
        no-gutters
        style="flex-wrap: nowrap;"
        class="pb-2">
        <v-col class="flex-grow-1 flex-shrink-0">
          <v-text-field
            v-model="topicId"
            :error-messages="topicIdErrors"
            required
            @input="$v.topicId.$touch()"
            @blur="$v.topicId.$touch()"
            label="Topic ID"/>
        </v-col>
        <v-col class="flex-grow-0 flex-shrink-1 pa-2">
          <v-btn type="submit">
            Join Match
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
</div>
</v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, helpers } from 'vuelidate/lib/validators';

const topicIdRegex = helpers.regex('accountIdRegex', /0.0.[0-9]{3,}/);

export default {
    mixins: [validationMixin],
    
    validations: {
        topicId: { required, topicIdRegex },
    },
    
    data () {
        return {
            topicId: ""
        }
    },
    
    computed: {
        topicIdErrors () {
            const errors = [];
            if (!this.$v.topicId.$dirty) return errors
            !this.$v.topicId.required && errors.push("A Topic ID is required.")
            !this.$v.topicId.topicIdRegex && errors.push('Topic ID should look like 0.0.xxx.')
            return errors;
        },
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL']),
        returnToAccountPanel () {
            this.topicId = "";
            this.SET_ACTIVE_PANEL('clientPanel');
        },
        submit () {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                this.joinMatch();
            }
        },
        async joinMatch() {
            this.matchCreationError = false;
            this.creatingMatch = true;
            let newMatchUrl = "/matches/" + this.topicId;
            this.$router.push(newMatchUrl);
        }
    },
}
</script>
