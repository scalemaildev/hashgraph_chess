/* State */
export const state = () => ({
    HC_DATA: ''
});

/* Mutations */
export const mutations = {
    SET_HC_DATA(state, newData) {
        state.HC_DATA = newData;
    },
    CHECK_HC_DATA(state) {
        if(state.HC_DATA){
            console.log('found hc data');
            return true;
        } else {
            console.log('no hc data found');
            return false;
        }
    },
};

/* Actions */
export const actions = {
    STORE_HC_DATA({ state, commit }, newData) {
        commit('SET_HC_DATA', newData);
    }
};
