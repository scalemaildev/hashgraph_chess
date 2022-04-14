/* State */
export const state = () => ({
    WALLET_DATA: {},

    /*
      {
      ACCOUNT_ID: '',
      CONNECTION_TOPIC: '',
      TOPIC_PRIVATE_KEY: '',
      TOPIC_PAIRING_STRING: '',
      METADATA: {}
      }
    */
});

/* Mutations */
export const mutations = {
    SAVE_WALLET_DATA(state, walletData) {
        state.WALLET_DATA = walletData;
    },
    CLEAR_WALLET_DATA(state) {
        state.WALLET_DATA = {};
        this.commit('sessionStorage/DISCONNECT_WALLET', {}, { root: true });
    },
    CHECK_WALLET_DATA(state) {
        if(Object.keys(state.WALLET_DATA).length > 0){
            this.commit('sessionStorage/SET_WALLET_DATA_FOUND', {}, { root: true });
        }
    },
};
