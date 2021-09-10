/* State */
export const state = () => ({
    ACTIVE_PANEL: 'loadingPanel',
    LOCK_BUTTON: false,
});

/* Mutations */
export const mutations = {
    SET_ACTIVE_PANEL(state, newPanel) {
	state.ACTIVE_PANEL = newPanel;
    },
    TOGGLE_LOCK_BUTTON(state, bool) {
	state.LOCK_BUTTON = bool;
    },
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


