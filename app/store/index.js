/* State */
export const state = () => ({
    consensusMessages: [],
    activePanel: 'startPanel',
    isClientSet: false,
});

/* Mutations */
export const mutations = {
    pushMessage(state, message) {
	state.consensusMessages.push(message);
    },
    setActivePanel(state, newPanel) {
	state.activePanel = newPanel;
    },
    setClientBool(state, clientBool) {
	state.isClientSet = clientBool;
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
