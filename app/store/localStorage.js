/* State */
export const state = () => ({
    HC_DATA: null
});

/* Mutations */
export const mutations = {
    STORE_HC_DATA(state, newData) {
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

