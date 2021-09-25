/* State */
export const state = () => ({
    SUBMITTING_MOVE: false,
    MOVE_SUBMISSION_ERROR: false,
});

/* Mutations */
export const mutations = {
    TOGGLE_SUBMITTING_MOVE(state, bool) {
        state.SUBMITTING_MOVE = bool;
    },
    TOGGLE_MOVE_SUBMISSION_ERROR(state, bool) {
        state.MOVE_SUBMISSION_ERROR = bool;
    }
};

/* Actions */
export const actions = {
    ASYNC_EMIT({ commit }, context) {
        if (!context.eventName) {
            console.error('No eventName in asyncEmit invocation!');
            return -1;
        }
        let eventName = context.eventName;
        let socket = window.$nuxt.$root.mainSocket;
        return new Promise(function (resolve) {
            socket.emit(eventName, context);
            socket.on(eventName, result => {
                socket.off(eventName);
                resolve(result);
            });
        });
    },
};


