/* State */
export const state = () => ({
    HC_DATA: false
});

/* Mutations */
export const mutations = {
    SET_HC_DATA(state, newData) {
        state.HC_DATA = newData;
    },
    CLEAR_HC_DATA(state) {
        state.HC_DATA = false;
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
