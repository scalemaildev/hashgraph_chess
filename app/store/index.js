/* State */
export const state = () => ({
    activePanel: 'loadingPanel',
    lockButton: false,
});

/* Mutations */
export const mutations = {
    setActivePanel(state, newPanel) {
	state.activePanel = newPanel;
    },
    toggleLockButton(state, bool) {
	state.lockButton = bool;
    },
};

/* Actions */
export const actions = {
    asyncEmit({ commit }, context) {
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
