/* State */
export const state = () => ({
    PRIVATE_KEY: '',
    ACCOUNT_ID: '',
    PAIRING_STRING: '',
    HC_TOPIC: ''
});

/* Mutations */
export const mutations = {
    SET_PRIVATE_KEY(state, newPrivateKey) {
        state.PRIVATE_KEY = newPrivateKey;
    },
    SET_ACCOUNT_ID(state, newAccountId) {
        state.ACCOUNT_ID = newAccountId;
    },
    SET_PAIRING_STRING(state, newPairingString) {
        state.PAIRING_STRING = newPairingString;
    },
    SET_HC_TOPIC(state, newTopicId) {
        state.HC_TOPIC = newTopicId;
    },
    CLEAR_HC_DATA(state) {
        state.PRIVATE_KEY = '';
        state.ACCOUNT_ID = '';
        state.PAIRING_STRING = '';
        state.HC_TOPIC = '';
    },
    CHECK_HC_DATA(state) {
        if(!!state.PRIVATE_KEY && !!state.ACCOUNT_ID && !!state.PAIRING_STRING && !!state.HC_TOPIC){
            console.log('found all hc data');
            this.commit('sessionStorage/SET_WALLET_CONNECTED', {}, { root: true });
        } else {
            // clear any leftover data in fields
            this.commit('localStorage/CLEAR_HC_DATA', {}, { root: true });
            console.log('no or incomplete hc data');
        }
    },
};
