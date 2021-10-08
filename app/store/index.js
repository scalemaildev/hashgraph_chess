/* State */
export const state = () => ({
    SUBMITTING_MOVE: false
});

/* Mutations */
export const mutations = {
    TOGGLE_SUBMITTING_MOVE(state, bool) {
        state.SUBMITTING_MOVE = bool;
    }
};
