/* State */
export const state = () => ({
    SMALL_SCREEN: false,
    SUBMITTING_MOVE: false
});

/* Mutations */
export const mutations = {
    TOGGLE_SMALL_SCREEN(state, bool) {
        state.SMALL_SCREEN = bool;
    },
    TOGGLE_SUBMITTING_MOVE(state, bool) {
        state.SUBMITTING_MOVE = bool;
    }
};
