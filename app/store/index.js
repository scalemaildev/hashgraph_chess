/* State */
export const state = () => ({
    topicMessages: [],
    activePanel: 'startPanel',
    isClientSet: false,
    accountId: "",
});

/* Mutations */
export const mutations = {
    pushMessage(state, message) {
	state.topicMessages.push(message);
    },
    setActivePanel(state, newPanel) {
	state.activePanel = newPanel;
    },
    setClientBool(state, clientBool) {
	state.isClientSet = clientBool;
    },
    setAccountId(state, accountId) {
	state.accountId = accountId;
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
