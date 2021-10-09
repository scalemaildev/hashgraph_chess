<template>
<div>
  <v-form
    @submit.prevent="submit">
    <v-row>
      <v-spacer />
      <v-col cols="8" align="center" justify="center">
        <v-text-field
          v-model="accountId"
          :error-messages="accountIdErrors"
          required
          @input="$v.accountId.$touch()"
          @blur="$v.accountId.$touch()"
          label="Testnet Account ID"/>
      </v-col>    
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="8" align="center" justify="center">
        <v-text-field
          v-model="privateKey"
          :error-messages="privateKeyErrors"
          type="password"
          required
          @input="$v.privateKey.$touch()"
          @blur="$v.privateKey.$touch()"
          label="Testnet Account Private Key"/>
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-col align="center" justify="center">
        <v-btn
          type="submit">
          Initialize Client
        </v-btn>
      </v-col>
      <v-spacer />
    </v-row>    
  </v-form>
  <div v-if="clientError" class="content-spaced-small">
    <v-row align="center" justify="center">
      <v-col cols="12" align="center" justify="center">
        <span style="color: red;"><h3>An error occurred initializing the client:</h3></span>
        <p style="color: red;">Double check your <strong>TESTNET</strong> Account ID and Private Key.</p>
      </v-col>
    </v-row>
  </div>
</div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, helpers } from 'vuelidate/lib/validators';

const accountIdRegex = helpers.regex('accountIdRegex', /0.0.[0-9]{3,}/);

export default {
    mixins: [validationMixin],
    
    validations: {
        accountId: { required, accountIdRegex },
        privateKey: { required },
    },
    
    data () {
        return {
            accountId: "",
            privateKey: "",
            clientError: false,
        }
    },
    
    computed: {
        accountIdErrors () {
            const errors = [];
            if (!this.$v.accountId.$dirty) return errors
            !this.$v.accountId.required && errors.push('Account ID is required.')
            !this.$v.accountId.accountIdRegex && errors.push('Account ID should look like 0.0.xxx.')
            return errors;
        },
        privateKeyErrors () {
            const errors = [];
            if (!this.$v.privateKey.$dirty) return errors
            !this.$v.privateKey.required && errors.push('Private Key is required.')
            return errors;
        }
    },
    
    methods: {
        ...mapMutations('sessionStorage', ['SET_ACTIVE_PANEL',
                                           'SET_ACCOUNT_ID',
                                           'SET_PRIVATE_KEY',
                                           'TOGGLE_LOCK_BUTTON']),
        ...mapActions('sessionStorage', ['INIT_HEDERA_CLIENT']),
        submit () {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                this.initHederaClient();
            }
        },
        async initHederaClient () {
            this.clientError = false;
            
            const response = await this.INIT_HEDERA_CLIENT({
                'accountId': this.accountId,
                'privateKey': this.privateKey
            });
            
            if (response.success) {
                this.SET_ACCOUNT_ID(this.accountId);
                this.SET_PRIVATE_KEY(this.privateKey);
                this.TOGGLE_LOCK_BUTTON(true);
                this.accountId = "";
                this.privateKey = "";
                this.SET_ACTIVE_PANEL('clientPanel');
            } else {
                this.privateKey = "";
                this.clientError = true;
            }
        },
    }
}
</script>
